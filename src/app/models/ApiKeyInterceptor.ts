import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiKey = "2baa715df444c41213f59f279dd081c2";
    const req2 = req.clone({url: req.url + "&appid=" + apiKey});
    return next.handle(req2);
  }
}
