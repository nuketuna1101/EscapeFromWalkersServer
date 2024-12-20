//====================================================================================================================
//====================================================================================================================
// src/handler/ping.js
// 핑
//====================================================================================================================
//====================================================================================================================

export const ping = (uuid, payload) => {
    if (!payload || !payload.message) {
        console.error('Invalid payload received:' + payload);
        return {
            status: 'fail',
            message: 'Invalid payload'
        };
    }
    const message = payload.message;
    console.log("[Ping] payload msg : " + message);
    // 핑 테스트 메시지 일치 확인
    if (message !== "ping test") {
        console.error('Invalid payload received:' + payload);
        return {
            status: 'fail',
            message: 'Msg Mismatched'
        };
    }
    // 채팅 메시지를 모든 클라이언트에게 브로드캐스트
    return {
        status: 'success',
        resType: 'ping',
        message: 'pong',
    };
};