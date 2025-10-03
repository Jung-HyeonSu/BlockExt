const BASE_URL = "http://3.36.89.98:8080/api/extensions";

// 고정 확장자 전체 조회
export async function fetchFixedExtensions(): Promise<{name:string, blocked:boolean}[]> {
  const res = await fetch(`${BASE_URL}/fixed`);
  return res.json();
}

// 커스텀 확장자 전체 조회
export async function fetchCustomExtensions(): Promise<{name:string}[]> {
  const res = await fetch(`${BASE_URL}/custom`);
  return res.json();
}

// 고정 확장자 차단/해제 변경
export async function setFixedBlocked(name: string, blocked: boolean) {
  const url = `${BASE_URL}/fixed/${encodeURIComponent(name)}/block?blocked=${blocked}`;
  const res = await fetch(url, { method: "POST" });
  return res.json();
}

// 커스텀 확장자 추가
export async function addCustomExtension(name: string) {
  const url = `${BASE_URL}/custom?name=${encodeURIComponent(name)}`;
  const res = await fetch(url, { method: "POST" });
  return res.json();
}

// 커스텀 확장자 삭제
export async function deleteCustomExtension(name: string) {
  const url = `${BASE_URL}/custom/${encodeURIComponent(name)}`;
  await fetch(url, { method: "DELETE" });
}

// 커스텀 확장자 전체 삭제
export async function deleteAllCustomExtensions() {
  const url = `${BASE_URL}/custom`;
  await fetch(url, { method: "DELETE" });
}