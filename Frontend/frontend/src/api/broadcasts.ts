// src/api/broadcasts.ts
import http from "./http";

export interface BroadcastOut {
    broadcast_id: number;
    user_id: number | null;
    area_id: number;
    title: string;
    content: string;
    is_anonymous: boolean;
    created_at: string;
}

export interface BroadcastCreate {
    user_id: number;
    area_id: number;
    title: string;
    content: string;
    is_anonymous: boolean;
}

// 获取广播列表
export function getBroadcasts(areaId?: number): Promise<BroadcastOut[]> {
    const path = areaId ? `/broadcasts?area_id=${areaId}` : "/broadcasts";
    return http.get<BroadcastOut[]>(path);
}

// 创建广播
export function createBroadcast(data: BroadcastCreate): Promise<BroadcastOut> {
    return http.post<BroadcastOut>("/broadcasts", data);
}

// 删除广播
export function deleteBroadcast(broadcastId: number) {
    return http.delete(`/broadcasts/${broadcastId}`);
}
