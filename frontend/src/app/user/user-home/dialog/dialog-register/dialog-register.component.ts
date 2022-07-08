import {Component, ElementRef, Inject, OnInit, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {BackendService} from "../../../../data-access/services/backend.service";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {AuthenticationService} from "../../../../data-access/services/authentication.service";
import {DialogLoginComponent} from "../dialog-login/dialog-login.component";
import {ToolbarComponent} from "../../sidenav/toolbar/toolbar.component";
import {DatePipe} from "@angular/common";
import {FormControl, Validators} from "@angular/forms";
import {UserFull} from "../../../../data-access/models/userFull";
import {BackendCommunicationService} from "../../../../data-access/services/backend-communication.service";
import {interval} from "rxjs";
import {Router} from "@angular/router";
import {DialogEditProfileComponent} from "../../../user-profile-view/dialog-edit-profile/dialog-edit-profile.component";
import {UserProfileViewComponent} from "../../../user-profile-view/user-profile-view.component";

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialog-register.component.html',
  styleUrls: ['./dialog-register.component.scss']
})

export class DialogRegisterComponent {
  hide: boolean = true;
  startDate = new Date(1995, 0, 1);
  username: string;
  password: string;
  passwordRepeat: string;
  profilePicture: string = "";
  date = new FormControl(null, Validators.required);
  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = 'Choose your Profile Picture';

  constructor(
    public dialogref: MatDialogRef<ForumComponent>,
    private backend: BackendService,
    private _snackBar: MatSnackBar,
    private authenticate: AuthenticationService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private backendCom: BackendCommunicationService) {
  }

  isPicked() {
    return this.fileAttr != 'Choose your Profile Picture';
  }

  registerUser(): void {
    if (this.username && this.password && this.passwordRepeat && this.date.value) {
      if (this.password == this.passwordRepeat) {
        this.authenticate.registerJwt(this.username, this.password, this.date.value, this.profilePicture).subscribe(d => {
          this._snackBar.openFromComponent(SnackBarOnRegisterSuccessComponent, {
            duration: 5000,
            data: "Click here to view your Profile",
          });
          this.dialogref.close()
        }, error => {
          let errorMsg = "Bad request.";
          if (error.status == 500) {
            errorMsg = "User already exists.";
          }
          this.username = "";
          this.password = "";
          this.passwordRepeat = "";
          this._snackBar.openFromComponent(SnackBarNotificationComponent, {
            duration: 5000,
            data: errorMsg,
          });
        });

      } else {
        this.password = "";
        this.passwordRepeat = "";
        this._snackBar.openFromComponent(SnackBarNotificationComponent, {
          duration: 5000,
          data: "Passwords do not match",
        })
      }
    } else {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Please fill out all fields",
      })
    }
  }

  uploadFileEvent(imgFile: any) {
    if (imgFile.target.files[0]) {
      this.fileAttr = imgFile.target.files[0].name;
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        console.log("The Name" + e.target.result)
        this.profilePicture = e.target.result
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Choose File';
    }
  }

  close(): void {
    this.dialogref.close();
  }

  openLogin(): void {
    this.dialogref.close();
    const dialogRef = this.dialog.open(DialogLoginComponent, {
      width: '30%'
    });
  }

  formatDate(data: Date): string {
    return this.datePipe.transform(data, 'dd.MM.yyyy')!;
  }
}

@Component({
  selector: "app-snack-bar-component-custom-success-message",
  templateUrl: './snack-bar-component-custom-success-message.html',
  styleUrls: ['./snack-bar-component-custom-success-message.scss']
})
export class SnackBarOnRegisterSuccessComponent implements OnInit {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarOnRegisterSuccessComponent>,
    private auth: AuthenticationService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private _snackRef: MatSnackBarRef<SnackBarOnRegisterSuccessComponent>,) {
  }

  progressbarValue = 100;
  curSec: number = 0;
  sub: any;

  ngOnInit(): void {
    const time = 45;
    const timer$ = interval(100);

    this.sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 - sec * 100 / time;
      this.curSec = sec;
      if (this.curSec === time) {
        this.sub.unsubscribe();
      }
    });
  }

  editProfile() {
    this.router.navigate(['/forum/users', this.auth.getCurrentUserId().toString()]);
    this.dismiss();
  }

  dismiss() {
    this.sub.unsubscribe();
    this._snackRef.dismiss();
  }
}
