import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { RedirectService } from "src/app/common/services/redirect.service";
import { NetworkService } from "./network.service";

// Класс перехватчика api-запросов.
@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
    constructor(private readonly _loader: NetworkService,
        private readonly _router: Router,
        private readonly _redirectService :RedirectService) {

    }

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        req = req.clone({
            headers: req.headers.set(
                "Authorization", "Bearer " + localStorage["t_n"]
            ),

            // Если нужно отправлять куки с каждым запросом.
            withCredentials: true
        });

        // req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        // req = req.clone({ headers: req.headers.set('Accept', 'multipart/form-data') });
        // req = req.clone({ headers: req.headers.set('Content-Type', 'multipart/form-data') });
        // req = req.clone({ headers: req.headers.set('Content-Type', 'multipart/form-data;boundary="boundary"') });

        let loadTimeout = setTimeout(()=> {
            this._loader.setBusy(true);
        }, 1000)

        return next.handle(req).pipe(
            catchError((response: HttpErrorResponse) => {
                if (response.status == 403 || response.status == 401) {
                    localStorage.clear();
                    this._router.navigate(["/user/signin"]).then(() => {
                        this._redirectService.redirect("user/signin");
                    });
                }

                return throwError(response.message);
            }),

            finalize(() => {
                clearTimeout(loadTimeout)
                this._loader.setBusy(false);
            }));
    }
}
