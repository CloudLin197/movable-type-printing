import { getStore } from "@netlify/blobs";
import { randomBytes } from "node:crypto";

const STORE_NAME = "mtp-share-snapshots";
const SCHEMA = "mtp-share-snapshot-v2";
const MAX_BYTES = 5_500_000;
const ID_RE = /^[A-Za-z0-9_-]{20,80}$/;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-content-type-options": "nosniff",
    },
  });
}

function validateSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return "数据快照为空";
  if (snapshot.schema !== SCHEMA && snapshot.schema !== "mtp-teacher-snapshot-v1") {
    return "数据快照版本不受支持";
  }
  if (!snapshot.data || typeof snapshot.data !== "object") return "数据快照缺少 data";
  if (snapshot.kind && !["teacher", "student"].includes(snapshot.kind)) return "数据快照类型不正确";
  return "";
}

export default async (request) => {
  const method = request.method.toUpperCase();
  const store = getStore({ name: STORE_NAME, consistency: "strong" });

  if (method === "POST") {
    const declared = Number(request.headers.get("content-length") || 0);
    if (declared > MAX_BYTES) return json({ error: "完整数据超过 5.5 MB 云端分享上限" }, 413);

    let raw;
    try {
      raw = await request.text();
    } catch {
      return json({ error: "无法读取上传的数据" }, 400);
    }

    const bytes = Buffer.byteLength(raw, "utf8");
    if (bytes > MAX_BYTES) return json({ error: "完整数据超过 5.5 MB 云端分享上限" }, 413);

    let snapshot;
    try {
      snapshot = JSON.parse(raw);
    } catch {
      return json({ error: "上传内容不是有效 JSON" }, 400);
    }

    const validationError = validateSnapshot(snapshot);
    if (validationError) return json({ error: validationError }, 400);

    const id = randomBytes(18).toString("base64url");
    const createdAt = new Date().toISOString();
    const result = await store.setJSON(
      id,
      { snapshot, createdAt, bytes },
      {
        onlyIfNew: true,
        metadata: {
          kind: snapshot.kind || "teacher",
          createdAt,
          bytes,
          students: Array.isArray(snapshot.data.students) ? snapshot.data.students.length : 0,
        },
      },
    );

    if (!result.modified) return json({ error: "分享编号生成冲突，请重试" }, 409);
    return json({ id, createdAt, bytes }, 201);
  }

  if (method === "GET") {
    const id = new URL(request.url).searchParams.get("id") || "";
    if (!ID_RE.test(id)) return json({ error: "分享编号格式不正确" }, 400);

    const entry = await store.get(id, { type: "json", consistency: "strong" });
    if (!entry || !entry.snapshot) return json({ error: "没有找到这份分享数据，链接可能无效" }, 404);

    const validationError = validateSnapshot(entry.snapshot);
    if (validationError) return json({ error: validationError }, 500);
    return json(entry.snapshot);
  }

  return json({ error: "只支持 GET 和 POST" }, 405);
};

export const config = {
  path: "/api/share-snapshot",
  method: ["GET", "POST"],
  rateLimit: {
    action: "rate_limit",
    aggregateBy: "ip",
    windowSize: 60,
    windowLimit: 30,
  },
};
