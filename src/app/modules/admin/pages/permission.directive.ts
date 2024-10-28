import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'

interface PermissionConfig {
  permission: string
  pageComponent: string
}

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class PermissionDirective implements OnInit {
  private subPermissionArray: any[] = []
  private config: PermissionConfig | null = null

  @Input() set appHasPermission(config: PermissionConfig) {
    this.config = config
    this.subPermission()
  }

  constructor(
    private _cookieService: CookieService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {  }

  private subPermission() {
    if (!this.config) return

    const groupPermissionCookieValue = this._cookieService.get('groupPermission')
    const groupPermission = groupPermissionCookieValue ? JSON.parse(groupPermissionCookieValue) : []

    const pagePermissions = groupPermission.find((item: any) => item.name === this.config!.pageComponent)
    this.subPermissionArray = pagePermissions ? pagePermissions.type : []
    
    this.updateView()
  }

  private updateView() {
    if (this.config && this.subPermissionArray.includes(this.config.permission)) this.viewContainer.createEmbeddedView(this.templateRef) // Show element
    else this.viewContainer.clear()
  }
}
