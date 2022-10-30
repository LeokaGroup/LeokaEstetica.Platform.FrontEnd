import { Injectable, Inject } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class LoadingScriptService {
    _loadedLibraries: { [url: string]: ReplaySubject<any> } = {};

    constructor(@Inject(DOCUMENT) private readonly document: any) { }

    public loadScripts(url: string): Observable<any> {
        if (this._loadedLibraries[url]) {
            return this._loadedLibraries[url].asObservable();
        }

        this._loadedLibraries[url] = new ReplaySubject();

        const script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = () => {
            this._loadedLibraries[url].next("");
            this._loadedLibraries[url].complete();
        };

        this.document.body.appendChild(script);

        return this._loadedLibraries[url].asObservable();
    };
}