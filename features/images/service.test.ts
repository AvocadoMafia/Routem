import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildPublicUrl, getStorageBucket } from "./service";

/**
 * buildPublicUrl の純粋関数ユニットテスト。
 *
 * NODE_ENV と MINIO_ENDPOINT / OCI_* 系 env を切り替えて、
 * dev (MinIO) / prod (OCI Object Storage) それぞれの公開URL生成ロジックを検証する。
 *
 * vitest が .env を自動ロードしているため、事前値との衝突を避けるために
 * 各テストで明示的に `vi.stubEnv` で値を差し替える。
 */
describe("buildPublicUrl (dev / MinIO)", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("NODE_ENV", "development");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("MINIO_ENDPOINT=http://localhost:9000 → そのまま連結した公開URLを返す", () => {
    vi.stubEnv("MINIO_ENDPOINT", "http://localhost:9000");
    expect(buildPublicUrl("rtmimages", "photos/foo.webp")).toBe(
      "http://localhost:9000/rtmimages/photos/foo.webp",
    );
  });

  it("MINIO_ENDPOINT の末尾スラッシュは 1 個でも除去される", () => {
    vi.stubEnv("MINIO_ENDPOINT", "http://localhost:9000/");
    expect(buildPublicUrl("rtmimages", "photos/foo.webp")).toBe(
      "http://localhost:9000/rtmimages/photos/foo.webp",
    );
  });

  it("MINIO_ENDPOINT の末尾スラッシュが複数あっても全て除去される", () => {
    vi.stubEnv("MINIO_ENDPOINT", "http://localhost:9000///");
    expect(buildPublicUrl("rtmimages", "photos/foo.webp")).toBe(
      "http://localhost:9000/rtmimages/photos/foo.webp",
    );
  });

  it("https スキームの MINIO_ENDPOINT も受け付ける", () => {
    vi.stubEnv("MINIO_ENDPOINT", "https://minio.internal.example.com");
    expect(buildPublicUrl("rtmimages", "photos/foo.webp")).toBe(
      "https://minio.internal.example.com/rtmimages/photos/foo.webp",
    );
  });

  it("MINIO_ENDPOINT 未定義時は http://localhost:9000 にフォールバックする", () => {
    vi.stubEnv("MINIO_ENDPOINT", "");
    expect(buildPublicUrl("rtmimages", "photos/foo.webp")).toBe(
      "http://localhost:9000/rtmimages/photos/foo.webp",
    );
  });

  it("key にスラッシュを含むネストされたパスも連結される", () => {
    vi.stubEnv("MINIO_ENDPOINT", "http://localhost:9000");
    expect(
      buildPublicUrl("rtmimages", "route-thumbnails/2025/abc.webp"),
    ).toBe("http://localhost:9000/rtmimages/route-thumbnails/2025/abc.webp");
  });

  it("bucket 名が 'rtmimages' 以外でも連結フォーマットは同じ", () => {
    vi.stubEnv("MINIO_ENDPOINT", "http://localhost:9000");
    expect(buildPublicUrl("custom-bucket", "key.webp")).toBe(
      "http://localhost:9000/custom-bucket/key.webp",
    );
  });
});

describe("buildPublicUrl (prod / OCI Object Storage)", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("NODE_ENV", "production");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("OCI_STORAGE_NAMESPACE と OCI_REGION から固定フォーマットの公開URLを組み立てる", () => {
    vi.stubEnv("OCI_STORAGE_NAMESPACE", "axabcxyz1234");
    vi.stubEnv("OCI_REGION", "ap-tokyo-1");
    expect(buildPublicUrl("rtmimages", "photos/foo.webp")).toBe(
      "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/axabcxyz1234/b/rtmimages/o/photos/foo.webp",
    );
  });

  it("OCI_REGION 未定義時は ap-tokyo-1 にフォールバックする", () => {
    vi.stubEnv("OCI_STORAGE_NAMESPACE", "axabcxyz1234");
    vi.stubEnv("OCI_REGION", "");
    expect(buildPublicUrl("rtmimages", "photos/foo.webp")).toBe(
      "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/axabcxyz1234/b/rtmimages/o/photos/foo.webp",
    );
  });

  it("別リージョン（例 us-ashburn-1）も正しく埋め込まれる", () => {
    vi.stubEnv("OCI_STORAGE_NAMESPACE", "axabcxyz1234");
    vi.stubEnv("OCI_REGION", "us-ashburn-1");
    expect(buildPublicUrl("rtmimages", "photos/foo.webp")).toBe(
      "https://objectstorage.us-ashburn-1.oraclecloud.com/n/axabcxyz1234/b/rtmimages/o/photos/foo.webp",
    );
  });

  it("ネストした key も URL にそのまま埋め込まれる", () => {
    vi.stubEnv("OCI_STORAGE_NAMESPACE", "axabcxyz1234");
    vi.stubEnv("OCI_REGION", "ap-tokyo-1");
    expect(
      buildPublicUrl("rtmimages", "user-profiles/123/icon.webp"),
    ).toBe(
      "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/axabcxyz1234/b/rtmimages/o/user-profiles/123/icon.webp",
    );
  });
});

describe("getStorageBucket", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("OCI_BUCKET_NAME が設定されていればそれを返す", () => {
    vi.stubEnv("OCI_BUCKET_NAME", "my-custom-bucket");
    expect(getStorageBucket()).toBe("my-custom-bucket");
  });

  it("OCI_BUCKET_NAME が空文字なら 'rtmimages' にフォールバック", () => {
    vi.stubEnv("OCI_BUCKET_NAME", "");
    expect(getStorageBucket()).toBe("rtmimages");
  });

  it("OCI_BUCKET_NAME 未定義（削除）でも 'rtmimages' にフォールバック", () => {
    vi.stubEnv("OCI_BUCKET_NAME", "");
    // stubEnv("", "") で事実上未定義相当。`||` 演算子が空文字を falsy として扱う挙動を確認
    expect(getStorageBucket()).toBe("rtmimages");
  });

  it("ステージング用などカスタム名（英数ハイフン）も受け付ける", () => {
    vi.stubEnv("OCI_BUCKET_NAME", "routem-staging-images");
    expect(getStorageBucket()).toBe("routem-staging-images");
  });
});
