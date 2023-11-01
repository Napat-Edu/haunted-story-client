import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { FormEvent } from "react";

interface IChildprops {
    isKeywordFormOpen: boolean;
    onMainKeywordChange(value: string): any;
    onSubKeywordChange(value: string): any;
    onSubmitKeyword(e: FormEvent<HTMLFormElement>): any;
}

export const KeywordForm = (props: IChildprops) => {

    return (
        <Dialog open={props.isKeywordFormOpen}>
            <DialogTitle>ได้เวลาใส่คีย์เวิร์ดแล้ว</DialogTitle>
            <form onSubmit={(e) => { props.onSubmitKeyword(e) }} id="keyword-input-form" >
                <DialogContent>
                    <TextField
                        required
                        autoFocus
                        id="main-keyword"
                        label="คำสุดหลอน"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { props.onMainKeywordChange(e.target.value) }}
                    />
                    <TextField
                        required
                        id="sub-keyword"
                        label="คำทั่วไป"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { props.onSubKeywordChange(e.target.value) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" type="submit" >ตกลง</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};