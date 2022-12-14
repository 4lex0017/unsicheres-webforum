import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptorAdmin implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.headers.get("admin"))
      return next.handle(req);

    const idToken = localStorage.getItem("bearerTokenAdmin");

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer " + idToken).set('Accept', 'application/json')
      });

      return next.handle(cloned);
    } else {
      const cloned = req.clone({
        headers: req.headers.set('Accept', 'application/json')
      });
      return next.handle(cloned);
    }
  }
}
