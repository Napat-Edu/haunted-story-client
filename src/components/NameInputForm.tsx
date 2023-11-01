import { Grid, TextField, Button } from "@mui/material";
import { FormEvent, useState } from "react";

interface IChildProps {
    onEnterGame(e: FormEvent<HTMLFormElement>, playerName: string): any;
}

export const NameInputForm = (props: IChildProps) => {
    const [playerName, setPlayerName] = useState('');

    return (
        <>
            <p>โปรดใส่ชื่อก่อนเล่น</p>
            <form onSubmit={(e) => { props.onEnterGame(e, playerName) }} id="name-input-form">
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    rowGap={2}
                >
                    <TextField
                        required
                        className="input-text"
                        variant="filled"
                        label="ชื่อ"
                        value={playerName}
                        onChange={(e) => { setPlayerName(e.target.value) }}
                    />
                    <Button type="submit" variant="contained" >พร้อมแล้ว</Button>
                </Grid>
            </form>
        </>
    );
};