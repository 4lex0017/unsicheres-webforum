import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DifficultyPickerService} from "../../../../data-access/services/difficulty-picker.service";
import {interval} from "rxjs";

@Component({
  selector: 'app-dialog-contact-form-dismiss',
  templateUrl: './dialog-contact-form-dismiss.component.html',
  styleUrls: ['./dialog-contact-form-dismiss.component.scss']
})
export class DialogContactFormDismissComponent implements OnInit {
  vEnabled: boolean;
  @ViewChild('content', {static: false}) content: ElementRef;
  progressbarValue = 100;
  curSec: number = 0;
  sub: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private diffPicker: DifficultyPickerService,
    public dialogRef: MatDialogRef<string>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {
  }

  ngOnInit(): void {
    this.vEnabled = this.diffPicker.isEnabledInConfig("add later");
    if (this.vEnabled) {
      this.changeDetectorRef.detectChanges();
      this.content.nativeElement.replaceChildren();
      this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.data));
    }
    this.timer();
  }

  close(): void {
    this.sub.unsubscribe();
    this.dialogRef.close();
  }

  timer(): void {
    const time = 65;
    const timer$ = interval(100);
    this.sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 - sec * 100 / time;
      this.curSec = sec;
      if (this.curSec === time) {
        this.close();
      }
    });
  }
}
