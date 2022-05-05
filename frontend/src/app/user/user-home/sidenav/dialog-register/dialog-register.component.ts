import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {BackendService} from "../../../../data-access/services/backend.service";

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialog-register.component.html',
  styleUrls: ['./dialog-register.component.scss']
})

export class DialogRegisterComponent{
  bar: ToolbarComponent;
  constructor(
    public dialogref: MatDialogRef<ForumComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogRegister,
    private backend: BackendService) {
  }

  registerUser(): void{
    if(this.data.username && this.data.password && this.data.repeatPassword){
      if(this.data.password == this.data.repeatPassword){
        this.createNewUser(this.data.username, this.data.password)
      }else{
        alert('Repeated password is different');
      }
    }else{
      alert('Please fill out every line');
    }
  }

  createNewUser(userName,userPassword){
    this.backend.loginData.LoginData.push(userName,userPassword);
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
