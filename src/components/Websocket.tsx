import { SetStateAction, useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { KeywordDialog } from './KeywordDialog';

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

    const [playerName, setPlayerName] = useState('');
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
            console.log("connected");
        });

        socket.on('game-state', (state) => {
            console.log(state.msg);
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

    const onEnterGame = () => {
        socket.emit('new-player-enter', { playerName: playerName, socketId: socket.id });
        setPlayerName('');
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
                        <h1>Game Room</h1>
                        {roomInfo.map((player, idx) => {
                            return (<div key={idx}>{player.playerName}</div>);
                        })}
                        {
                            isHost ?
                                !isStoryStart ?
                                    <button onClick={onStartGame}>Game Start</button> :
                                    <button onClick={onStartGame}>Restart Game</button> :
                                <></>
                        }
                        {
                            (!isHost && !isStoryStart) ?
                                <div>wait for host start the game...</div> :
                                <></>
                        }
                        {
                            isStoryStart ?
                                <div>
                                    <button onClick={() => { handleOpenKeywordDialog(currentKeyword.mainKey) }}>open main keyword</button>
                                    <button onClick={() => { handleOpenKeywordDialog(currentKeyword.subKey) }}>open sub keyword</button>
                                </div> :
                                <></>
                        }
                    </div> :
                    <div>
                        <h1>Enter Your Name</h1>
                        <input type="text" value={playerName} onChange={(e) => { setPlayerName(e.target.value) }} />
                        <button onClick={onEnterGame} >Submit</button>
                    </div>
            }

            <Dialog open={isKeywordFormOpen}>
                <DialogTitle>Keyword Input</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        main keyword : haunted words <br />
                        sub keyword : any words you like!
                    </DialogContentText>
                    <TextField
                        autoFocus
                        id="main-keyword"
                        label="main keyword"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { onMainKeywordChange(e.target.value) }}
                    />
                    <TextField
                        id="sub-keyword"
                        label="sub keyword"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { onSubKeywordChange(e.target.value) }}
                    />
                </DialogContent>
                <DialogActions>
                    <button onClick={onSubmitKeyword}>Submit</button>
                </DialogActions>
            </Dialog>

            <KeywordDialog
                isKeywordDialogOpen={isKeywordDialogOpen}
                keyword={focusKeyword}
                handleCloseKeywordDialog={handleCloseKeywordDialog}
            />
        </>
    );
};