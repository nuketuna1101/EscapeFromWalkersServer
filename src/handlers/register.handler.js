
//====================================================================================================================
//====================================================================================================================
// src/handler/register.handler.js
// 회원 등록 핸들러
//====================================================================================================================
//====================================================================================================================

import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handleEvent } from './helper.js';
import { getGameAssets } from '../init/asset.js';

const registerHandler = (io) => {
    /*
    io.on('connection', (socket) => {
        // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리하는 곳
        // UUID 생성
        const userUUID = uuidv4();
        // 사용자 추가
        addUser({ uuid: userUUID, socketId: socket.id });
        // 접속시 유저 정보 생성 이벤트 처리
        handleConnection(socket, userUUID);
        // 메세지를 data 란 이름으로 handlerEvent 함수로 전달합니다.
        socket.on('event', (data) => {
            console.log("Event received:", data); // 로그 추가
            handleEvent(io, socket, data);
        });
        // 접속 해제 시 이벤트 처리
        socket.on('disconnect', () => handleDisconnect(socket, userUUID));
    });
    */

    io.on('connection', (socket) => {
        const userUUID = uuidv4();
        // 사용자 추가
        addUser({ uuid: userUUID, socketId: socket.id });
        handleConnection(socket, userUUID);

        // "ping" 이벤트 처리
        socket.on('ping', (data) => {
            console.log('[Ping] ping received:' + data);
            socket.emit('pong', { message: 'pong' });
        });

        // 위치 정보 수신 처리 (예시: 'location' 이벤트)
        socket.on('location', (data) => {
            console.log('[Location] Location data received:', data);
            // 다른 클라이언트에게 위치 데이터를 브로드캐스트
            // 서버에서 위치 데이터를 다른 모든 클라이언트에게 전달
            io.emit('locationUpdate', {
                status: "success",
                uuid: socket.id,
                position: {
                    x: data.position.x,
                    y: data.position.y,
                    z: data.position.z
                }
            });
        });


        // map asset 처리
        socket.on('reqMapAssets', (data) => {
            console.log('[reqMapAssets] reqMapAssets received:', data);
            const { maps } = getGameAssets();
            console.log('[reqMapAssets] reqMapAssets received:', maps);

            socket.emit('resMapAssets', {
                status: "success",
                uuid: socket.id,
                maps: maps
            });
        });


        // 접속 해제 시 이벤트 처리
        socket.on('disconnect', () => handleDisconnect(socket, userUUID));
    });

};

export default registerHandler;



export const gameStart = (uuid, payload) => {
    // 서버 메모리에 있는 게임 에셋에서 stage 정보를 가지고 온다.
    const { stages } = getGameAssets();
    // 스테이지 초기화를 위해 비우기
    clearStage(uuid);
    // stages 배열에서 0번째 = 첫번째스테이지 의 ID를 해당 유저의 stage에 저장한다.
    setStage(uuid, stages.data[0].id, payload.timestamp);
    // 로그를 찍어 확인.
    console.log('Stage:', getStage(uuid));
    return { status: 'success' };
};