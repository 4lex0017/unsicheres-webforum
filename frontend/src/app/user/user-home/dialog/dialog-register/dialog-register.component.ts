import {Component, ElementRef, Inject, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {AuthenticationService} from "../../../../data-access/services/authentication.service";
import {DialogLoginComponent} from "../dialog-login/dialog-login.component";
import {DatePipe} from "@angular/common";
import {FormControl, Validators} from "@angular/forms";
import {interval} from "rxjs";
import {Router} from "@angular/router";
import {DidAThingServiceService} from "../../../../shared/did-a-thing/did-a-thing-service.service";


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
    private _snackBar: MatSnackBar,
    private authenticate: AuthenticationService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private didAThing: DidAThingServiceService) {
  }

  isPicked() {
    return this.fileAttr != 'Choose your Profile Picture';
  }

  registerUser(): void {
    if (this.username && this.password && this.passwordRepeat && this.date.value) {
      let error = "";
      if (this.username.length < 5) {
        error = "Name too short! At least 5 characters.";
      }
      if (this.username.length > 150) {
        error = "Name too long! < 150 characters!"
        this.username = "";
      }
      if (error != "") {
        this._snackBar.openFromComponent(SnackBarNotificationComponent, {
          duration: 5000,
          panelClass: ['snack-bar-background'],
          data: error,
        });
        return;
      }

      if (this.password == this.passwordRepeat) {
        this.authenticate.registerJwt(this.username, this.password, this.date.value, this.profilePicture).subscribe(data => {
          if (data['headers'].get('vulnfound') == "true") {
            this.didAThing.sendMessage();
          }
          this._snackBar.openFromComponent(SnackBarOnRegisterSuccessComponent, {
            duration: 5000,
            data: "Click here to view your Profile",
          });
          this.dialogref.close()
        }, error => {
          let errorMsg = "Bad request.";
          if (error.value == 500) {
            errorMsg = "User already exists.";
          }
          this.username = "";
          this.password = "";
          this.passwordRepeat = "";
          this._snackBar.openFromComponent(SnackBarNotificationComponent, {
            duration: 5000,
            panelClass: ['snack-bar-background'],
            data: errorMsg,
          });
        });

      } else {
        this.password = "";
        this.passwordRepeat = "";
        this._snackBar.openFromComponent(SnackBarNotificationComponent, {
          duration: 5000,
          panelClass: ['snack-bar-background'],
          data: "Passwords do not match",
        })
      }
    } else {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Please fill out all fields",
      })
    }
  }

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

  close(): void {
    this.dialogref.close();
  }

  openLogin(): void {
    this.dialogref.close();
    this.dialog.open(DialogLoginComponent, {
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
