import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

interface IKeywordDialog {
    isKeywordDialogOpen: boolean,
    keyword: string,
    handleCloseKeywordDialog: any
}

export const KeywordDialog = (props: IKeywordDialog) => {

    return (
        <>
            <Dialog open={props.isKeywordDialogOpen}>
                <DialogTitle>คีย์เวิร์ด</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.keyword}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button onClick={props.handleCloseKeywordDialog}>ปิด</button>
                </DialogActions>
            </Dialog>
        </>
    );
}