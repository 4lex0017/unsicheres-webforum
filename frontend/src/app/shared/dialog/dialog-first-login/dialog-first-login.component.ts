import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-first-login',
  templateUrl: './dialog-first-login.component.html',
  styleUrls: ['./dialog-first-login.component.scss']
})
export class DialogFirstLoginComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DialogFirstLoginComponent>) {
    dialogRef.disableClose = true;
  }

  buttonState: boolean = true;
  timer: number = 10;

  header: string;
  subHeader1: string;
  subHeader2: string;
  subHeader3: string;
  subHeader4: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;

  currentLanguage: boolean = true;

  headerEnglish: string = "ATTENTION - This message will only show up ONCE";
  p1English: string = "This Application uses a cookie to track you and your found vulnerabilities. " +
    "If you delete your cookie your professor won't be able to see your accomplishments."
  p2English: string = "The cookie has to be included in EVERY request you send, even if you use external programs like Postman. " +
    "If you don't know how to get your cookie, there is a button (in the footer of the website) to give you access to it " +
    "without checking your browsers storage."
  p3English: string = "Tracking you is the only use of the cookie. Do not tinker with or delete it expecting to find vulnerabilities. " +
    "If the cookie is not set, all backend requests will FAIL. "
  p4English: string = "If you still manage to delete or edit it and are unable to revert the changes, ask your professor. They have access to the database and can restore it."
  subHeader1English: string = "What is this about?";
  subHeader2English: string = "What if I don't care?";
  subHeader3English: string = "But what if there is a vulnerability?";
  subHeader4English: string = "I deleted it anyways. What now?";


  headerGerman: string = "ACHTUNG - Diese Meldung wird nur EINMAL angezeigt";
  p1German: string = "Diese Anwendung verwendet einen Cookie, um Sie und Ihre gefundenen Schwachstellen zu tracken. " +
    "Wenn Sie Ihren Cookie löschen, kann Ihr Professor Ihre erbrachten Leistungen nicht mehr sehen."
  p2German: string = "Der Cookie muss in JEDER Anfrage enthalten sein, selbst wenn Sie externe Programme " +
    "wie Postman verwenden. Falls Sie nicht wissen, wo Sie Ihren Cookie finden, gibt es einen extra Button " +
    "(in der Fußzeile der Website), mit dem Sie ihn abrufen können."
  p3German: string = "Die einzige Aufgabe des Cookies ist, Sie zu tracken. Basteln Sie nicht an ihm herum oder löschen ihn, um eine " +
    "Schwachstelle zu finden. Falls der Cookie nicht gesetzt ist, werden alle Backend-Anfragen abgelehnt. "
  p4German: string = "Falls es Ihnen doch gelingt den Cookie zu verändern oder zu löschen, ohne ihn wiederherstellen zu können, fragen Sie Ihren Professor. Er/Sie hat Zugriff auf die Datenbank und kann ihn wiederherstellen."
  subHeader1German: string = "Worum geht es hier?";
  subHeader2German: string = "Was ist, wenn es mir egal ist?";
  subHeader3German: string = "Aber was, wenn es da eine Schwachstelle gibt?";
  subHeader4German: string = "Hab ihn trotzdem gelöscht. Was jetzt?";
  timeLeft: number = 10;
  interval;


  ngOnInit(): void {
    this.setEnglish();
    this.startTimer()
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.buttonState = false;
      }
    }, 1000)
  }

  close() {
    this.dialogRef.close();
  }

  changeLanguage() {
    if (this.currentLanguage) this.setGerman()
    else this.setEnglish();
  }

  setEnglish() {
    this.header = this.headerEnglish;
    this.p1 = this.p1English;
    this.p2 = this.p2English;
    this.p3 = this.p3English;
    this.p4 = this.p4English;
    this.subHeader1 = this.subHeader1English;
    this.subHeader2 = this.subHeader2English;
    this.subHeader3 = this.subHeader3English;
    this.subHeader4 = this.subHeader4English;
    this.currentLanguage = true;
  }

  setGerman() {
    this.header = this.headerGerman;
    this.p1 = this.p1German;
    this.p2 = this.p2German;
    this.p3 = this.p3German;
    this.p4 = this.p4German;
    this.subHeader1 = this.subHeader1German;
    this.subHeader2 = this.subHeader2German;
    this.subHeader3 = this.subHeader3German;
    this.subHeader4 = this.subHeader4German;
    this.currentLanguage = false;
  }
}
