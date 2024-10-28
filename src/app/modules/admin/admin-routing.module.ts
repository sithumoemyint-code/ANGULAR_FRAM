import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { generateRoutes } from './dynamic-routes'

// real routing
const routes: Routes = [
  ...generateRoutes()
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
