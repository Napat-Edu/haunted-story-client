import { FormEvent, SetStateAction, useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { KeywordDialog } from './KeywordDialog';
import { Candle } from "./Candle";
import { NameInputForm } from "./NameInputForm";
import { PlayerSection } from "./PlayerSection";

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

    const onSubmitKeyword = () => {
        socket.emit("keyword-input", {
            msg: "player sent the keywords",
            socketId: socket.id,
            keywords: {
                mainKey: mainKeywordInput,
                subKey: subKeywordInput,
            }
        });
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
                                <div>
                                    <button onClick={() => { handleOpenKeywordDialog(currentKeyword.mainKey) }}>เปิดดูคำหลอน</button>
                                    <button onClick={() => { handleOpenKeywordDialog(currentKeyword.subKey) }}>เปิดดูคำทั่วไป</button>
                                </div> :
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

            <Dialog open={isKeywordFormOpen}>
                <DialogTitle>ได้เวลาใส่คีย์เวิร์ดแล้ว</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        id="main-keyword"
                        label="คำสุดหลอน"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { onMainKeywordChange(e.target.value) }}
                    />
                    <TextField
                        id="sub-keyword"
                        label="คำทั่วไป"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { onSubKeywordChange(e.target.value) }}
                    />
                </DialogContent>
                <DialogActions>
                    <button onClick={onSubmitKeyword}>ตกลง</button>
                </DialogActions>
            </Dialog>

            <KeywordDialog
                isKeywordDialogOpen={isKeywordDialogOpen}
                keyword={focusKeyword}
                handleCloseKeywordDialog={handleCloseKeywordDialog}
            />

            <Candle />
        </>
    );
};