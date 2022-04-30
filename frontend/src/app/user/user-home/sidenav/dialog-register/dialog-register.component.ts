import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {ToolbarComponent} from "../toolbar/toolbar.component";

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialog-register.component.html',
  styleUrls: ['./dialog-register.component.scss']
})

export class DialogRegisterComponent{
  bar: ToolbarComponent;
  constructor(
    public dialogref: MatDialogRef<ForumComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogRegister) {
  }

  registerUser(): void{

  }

  close():void{
    this.dialogref.close();
  }
}

export interface DialogRegister{
  username: string;
  password: string;
  repeatPassword: string;
}
