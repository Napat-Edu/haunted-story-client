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
                <DialogTitle>Main Keyword</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.keyword}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button onClick={props.handleCloseKeywordDialog}>Close</button>
                </DialogActions>
            </Dialog>
        </>
    );
}