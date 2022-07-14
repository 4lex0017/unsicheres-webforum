import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class AllowEditService {
  allowEdit: boolean = true;

  constructor() {
  }

  askForEdit(): boolean {
    if (!this.allowEdit) {
      return false;
    } else {
      this.allowEdit = false;
      return true;
    }
  }

  finishEdit(): void {
    this.allowEdit = true;
  }
}
