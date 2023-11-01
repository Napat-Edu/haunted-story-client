import { FormEvent, SetStateAction, useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";
import { Button, Grid } from "@mui/material";
import { KeywordDialog } from './KeywordDialog';
import { Candle } from "./Candle";
import { NameInputForm } from "./NameInputForm";
import { PlayerSection } from "./PlayerSection";
import { KeywordForm } from "./KeywordForm";

interface IPlayerData {
    playerName: string,
    socketId: string,
    isHost: boolean,
    isReady: boolean,
    keywords: {
        mainKey: string,
        subKey: string,
    }
}

interface IKeywords {
    mainKey: string,
    subKey: string,
}

export const Websocket = () => {

    const socket = useContext(WebsocketContext);

    const [isReady, setIsReady] = useState(false);
    const [isHost, setIsHost] = useState(false);

    const [roomInfo, setRoomInfo] = useState<IPlayerData[]>([]);
    const [currentKeyword, setCurrentKeyword] = useState<IKeywords>({
        mainKey: "",
        subKey: "",
    });
    const [focusKeyword, setFocusKeyword] = useState("");

    const [isKeywordFormOpen, setIsKeywordFormOpen] = useState(false);
    const [isStoryStart, setIsStoryStart] = useState(false);
    const [isKeywordDialogOpen, setIsKeywordDialogOpen] = useState(false);
    const [mainKeywordInput, setMainKeywordInput] = useState("");
    const [subKeywordInput, setSubKeywordInput] = useState("");

    useEffect(() => {
        socket.on('connect', () => {
            // connected to server
        });

        socket.on('game-state', (state) => {
            setIsKeywordFormOpen(state.isKeywordInputState);
            setIsStoryStart(state.isStoryStart);
        });

        return () => {
            socket.off('connect');
            socket.off('game-state');
        };
    }, []);

    useEffect(() => {
        socket.on('update-room-info', (data) => {
            setRoomInfo([...data.players]);
            updatePlayerState(data.players);
        });

        return () => {
            socket.off('update-room-info');
        };
    }, [roomInfo]);

    const updatePlayerState = (players: IPlayerData[]) => {
        const playerInfo = players.find((player) => {
            return (player.socketId === socket.id);
        });
        setIsReady(playerInfo?.isReady ?? false);
        setIsHost(playerInfo?.isHost ?? false);
        setCurrentKeyword({
            mainKey: playerInfo?.keywords.mainKey ?? "",
            subKey: playerInfo?.keywords.subKey ?? "",
        });
    };

    const onEnterGame = (e: FormEvent<HTMLFormElement>, playerName: string) => {
        socket.emit('new-player-enter', { playerName: playerName, socketId: socket.id });
        e.preventDefault();
    };

    const onStartGame = () => {
        socket.emit('start-game', { msg: "host is start the game" });
    };

    const onSubmitKeyword = (e: FormEvent<HTMLFormElement>) => {
        socket.emit("keyword-input", {
            msg: "player sent the keywords",
            socketId: socket.id,
            keywords: {
                mainKey: mainKeywordInput,
                subKey: subKeywordInput,
            }
        });
        e.preventDefault();
    };

    const onMainKeywordChange = (data: SetStateAction<string>) => {
        setMainKeywordInput(data);
    };

    const onSubKeywordChange = (data: SetStateAction<string>) => {
        setSubKeywordInput(data);
    };

    const handleOpenKeywordDialog = (keyword: string) => {
        setIsKeywordDialogOpen(true);
        setFocusKeyword(keyword);
    };

    const handleCloseKeywordDialog = () => {
        setIsKeywordDialogOpen(false);
    };

    return (
        <>
            {
                isReady ?
                    <div>
                        <h1>ห้องเล่นเกม</h1>
                        <PlayerSection roomInfo={roomInfo} />
                        {
                            isHost ?
                                !isStoryStart ?
                                    <Button variant="contained" color="success" onClick={onStartGame}>เริ่มเกม</Button> :
                                    <Button variant="contained" color="warning" onClick={onStartGame}>เริ่มเกมใหม่</Button> :
                                <></>
                        }
                        {
                            (!isHost && !isStoryStart) ?
                                <div>รอให้หัวหน้าห้องเริ่มเกม...</div> :
                                <></>
                        }
                        {
                            isStoryStart ?
                                <Grid
                                    container
                                    justifyContent="center"
                                    columnGap={2}
                                    sx={{ my: 2 }}
                                >
                                    <Button variant="contained" onClick={() => { handleOpenKeywordDialog(currentKeyword.mainKey) }}>เปิดดูคำหลอน</Button>
                                    <Button variant="contained" onClick={() => { handleOpenKeywordDialog(currentKeyword.subKey) }}>เปิดดูคำทั่วไป</Button>
                                </Grid> :
                                <></>
                        }
                    </div> :
                    <div>
                        <h1>Haunted Story</h1>
                        <Grid
                            container
                            justifyContent="center"
                            columns={{ lg: 12 }}
                        >
                            <Grid item lg={4} >
                                <img className="img-title" src="/ghost-title.png" alt="ghost-title-img" />
                            </Grid>
                        </Grid>

                        <NameInputForm
                            onEnterGame={onEnterGame}
                        />
                    </div>
            }

            <KeywordForm
                isKeywordFormOpen={isKeywordFormOpen}
                onMainKeywordChange={onMainKeywordChange}
                onSubKeywordChange={onSubKeywordChange}
                onSubmitKeyword={onSubmitKeyword}
            />

            <KeywordDialog
                isKeywordDialogOpen={isKeywordDialogOpen}
                keyword={focusKeyword}
                handleCloseKeywordDialog={handleCloseKeywordDialog}
            />

            <Candle />
        </>
    );
};