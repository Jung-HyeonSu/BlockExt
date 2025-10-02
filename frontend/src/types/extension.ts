// 확장자 관련 타입 정의
export type ExtensionType = 'fixed' | 'custom';

export interface Extension {
  type: ExtensionType;
  value: string;
}