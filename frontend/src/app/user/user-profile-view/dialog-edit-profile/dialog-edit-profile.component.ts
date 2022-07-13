import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserProfileViewComponent} from "../user-profile-view.component";
import {UserFullBackend} from "../../../data-access/models/userFullBackendModel";

@Component({
  selector: 'app-dialog-edit-profile',
  templateUrl: './dialog-edit-profile.component.html',
  styleUrls: ['./dialog-edit-profile.component.scss']
})
export class DialogEditProfileComponent {
  constructor(
    public dialogRef: MatDialogRef<UserProfileViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserFullBackend,
  ) {
  }

  location = this.data.location;
  name = this.data.name;
  about = this.data.about;
  profilePicture: string = this.data.profilePicture

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAccept(): void {
    let closeData = {
      location: this.location,
      name: this.name,
      about: this.about,
      profilePicture: this.profilePicture
    }
    this.dialogRef.close(closeData);
  }

  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = 'Choose Picture';

  uploadFileEvent(imgFile: any) {
    if (imgFile.target.files[0]) {
      this.fileAttr = imgFile.target.files[0].name;
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicture = e.target.result
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Choose File';
    }
  }
}
