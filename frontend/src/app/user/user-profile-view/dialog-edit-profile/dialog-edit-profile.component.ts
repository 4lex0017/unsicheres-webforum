import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserFull} from "../../../data-access/models/userFull";
import {UserProfileViewComponent} from "../user-profile-view.component";

@Component({
  selector: 'app-dialog-edit-profile',
  templateUrl: './dialog-edit-profile.component.html',
  styleUrls: ['./dialog-edit-profile.component.scss']
})
export class DialogEditProfileComponent {
  constructor(
    public dialogRef: MatDialogRef<UserProfileViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserFull,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = 'Choose File';

  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: any) => {
        this.fileAttr += file.name + ' - ';
      });
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          this.data.profile_picture = e.target.result
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Choose File';
    }
  }
}
