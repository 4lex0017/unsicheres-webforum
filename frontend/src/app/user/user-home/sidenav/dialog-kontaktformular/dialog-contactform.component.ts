import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {BackendService} from "../../../../data-access/services/backend.service";

@Component({
  selector: 'app-dialog-formular',
  templateUrl: './dialog-contactform.component.html',
  styleUrls: ['./dialog-contactform.component.scss']
})

export class DialogContactformComponent{
  constructor(
    public dialogref: MatDialogRef<ForumComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogContact,
    private backend: BackendService) {
  }

  public checkFile(): void{
    if(this.data.username && this.data.topic && this.data.message){
      this.sendFile(this.data.username, this.data.topic, this.data.message)
    }else{
      alert('Please fill out every field');
    }
  }

  public sendFile(username, topic, message){
    this.backend.contactForms.Forms.push(username,topic,message);
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
