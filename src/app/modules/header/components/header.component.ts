import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import { HeaderService } from "../services/header.service";
import { BehaviorSubject, Subscription } from "rxjs";
import { HeaderMenuItem } from "../../../core/models/header-menu-item.model";

interface HeaderItem {
    label: string,
    routerLink: string,
    command?: () => void,
}

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})

/**
 * Класс компонента header.
 */
export class HeaderComponent implements OnInit, OnDestroy {
    public readonly headerData$: BehaviorSubject<HeaderMenuItem[]> = this._headerService.headerData$;
    isHideAuthButtons = false;
    isMobileMenuOpen = false;

    items: HeaderItem[] = [
        {
            label: 'Заказы',
            routerLink: '/profile/orders'
        },
        {
            label: 'Заявки в поддержку',
            routerLink: '/profile/tickets'
        },
        {
            label: 'Выйти',
            routerLink: '/user/signin',
            command: () => {
                localStorage.clear()
            }
        }
    ];

    private subscriptions: Subscription = new Subscription();

    constructor(private readonly _headerService: HeaderService,
                private readonly _activatedRoute: ActivatedRoute,
                private readonly _router: Router,
                private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
        const dataSubscription = this._headerService.getHeaderItemsAsync().subscribe();
        this.subscriptions.add(dataSubscription);

        const headerDataSubscription = this.headerData$.subscribe();
        this.subscriptions.add(headerDataSubscription);

        const queryParamsSubscription = this._activatedRoute.queryParams.subscribe(_ => this.rerenderAuthButtons());
        this.subscriptions.add(queryParamsSubscription);

        const routerEventsSubscription = this._router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.isMobileMenuOpen = false;
                this.controlBodyElementScroll();
            }
        });
        this.subscriptions.add(routerEventsSubscription);

        this.isHideAuthButtons = !!localStorage["t_n"];
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private rerenderAuthButtons() {
        this.isHideAuthButtons = !this.isHideAuthButtons;
        this.changeDetectorRef.detectChanges();
    }

    public onHamburgerCLick() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen
        this.controlBodyElementScroll()
    }

    private controlBodyElementScroll(): void {
        if(this.isMobileMenuOpen) {
            document.body.classList.add('no-scroll')
        } else {
            document.body.classList.remove('no-scroll')
        }
    }
}
