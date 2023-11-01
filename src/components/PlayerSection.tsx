import { Grid, Card } from "@mui/material";

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

interface IChildProps {
    roomInfo: IPlayerData[]
}

export const PlayerSection = (props: IChildProps) => {

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            columns={{ xs: 4, sm: 8, md: 12 }}
            spacing={2}
            sx={{ mb: 2 }}
        >
            {props.roomInfo.map((player, idx) => {
                return (
                    <Grid
                        item
                        key={"player-card" + idx}
                    >
                        <Card
                            key={idx}
                            variant="outlined"
                            sx={{ minHeight: 50, maxHeight: 100, minWidth: 100, maxWidth: 150 }}
                        >
                            {player.playerName}
                            {player.isHost ? <img className="host-symbol" src="/host-icon.png" alt="host-crown" /> : <></>}
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};