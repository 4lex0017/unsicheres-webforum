import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";

@Component({
  selector: 'app-dialog-formular',
  templateUrl: './dialog-contactform.component.html',
  styleUrls: ['./dialog-contactform.component.scss']
})

export class DialogContactformComponent{
  constructor(
    public dialogref: MatDialogRef<ForumComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogContact) {
  }

  public sendFile(): void{

  }

  public close(): void{
    this.dialogref.close();
  }
}

export interface DialogContact{
  username: string;
  topic: string;
  message: string;
}
