import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { NetworkService } from "./network.service";

// Класс перехватчика api-запросов.
@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
    constructor(private loader: NetworkService) {

    }

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        req = req.clone({
            headers: req.headers.set(
                "Authorization", "Bearer " + localStorage["token"]
            ),

            // Если нужно отправлять куки с каждым запросом.
            withCredentials: true
        });

        // req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        // req = req.clone({ headers: req.headers.set('Accept', 'multipart/form-data') });
        // req = req.clone({ headers: req.headers.set('Content-Type', 'multipart/form-data') });
        // req = req.clone({ headers: req.headers.set('Content-Type', 'multipart/form-data;boundary="boundary"') });

        this.loader.setBusy(true);

        return next.handle(req).pipe(
            catchError((response: HttpErrorResponse) => {
                // this.commonService.routeToStart(response);
                return throwError(response.message);
            }),

            finalize(() => {
                this.loader.setBusy(false);
            }));
    }
}
