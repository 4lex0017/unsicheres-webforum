import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {BackendService} from "../../../../data-access/services/backend.service";

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.scss']
})
export class DialogLoginComponent{
  bar: ToolbarComponent;
  constructor(
    public dialogRef: MatDialogRef<ForumComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogLogin) {
  }

  checkeLogin(): void{
    if(this.data.username && this.data.password){

    }else if(this.data.username && !this.data.password){
      alert('Falsches Passwort')
    }else{
      alert('Falscher Username und falsches Passwort');
    }

  }

  close():void{
    this.dialogRef.close();
  }
}

export interface DialogLogin{
  username: string;
  password: string;
}
