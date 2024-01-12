import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarPlantillasComponent } from './components/plantillas/listar-plantillas/listar-plantillas.component';
import { EditarPlantillaComponent } from './components/plantillas/editar-plantilla/editar-plantilla.component';
import { CrearPlantillaComponent } from './components/plantillas/crear-plantilla/crear-plantilla.component';
import { ListarDocumentosComponent } from './components/documentos/listar-documentos/listar-documentos.component';
import { CrearDocumentoComponent } from './components/documentos/crear-documento/crear-documento.component';
import { EditarDocumentoComponent } from './components/documentos/editar-documento/editar-documento.component';
import { CrearPlantillaConSeleccionComponent } from './components/plantillas/crear-plantilla-con-seleccion/crear-plantilla-con-seleccion.component';
import { LoginComponent } from './components-user/inicio-sesion/login/login.component';
import { UserRegisterComponent } from './components-user/inicio-sesion/registro/registro.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components-user/user/user.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { AdministrativosComponent } from './components/administrativos/administrativos.component';
import { UserProfileComponent } from './components-user/user-profile/user-profile.component';
import { HomeUserComponent } from './components-user/home-user/home-user.component';
import { BusquedaAvanzadaComponent } from './components-user/busqueda-avanzada/busqueda-avanzada.component';
import { BusquedaSencillaComponent } from './components-user/busqueda-sencilla/busqueda-sencilla.component';
import { DetallesDocumentoComponent } from './components-user/detalles-documento/detalles-documento.component';
import { CarrouselUploadComponent } from './components/carrousel-upload/carrousel-upload.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { AuthGuard } from './auth.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ListarAdministrativosComponent } from './components/listar-administrativos/listar-administrativos.component';
import { EditarAdministrativosComponent } from './components/editar-administrativos/editar-administrativos.component';



const routes: Routes = [
  { path: 'admin' , component:AdminComponent, children: [
  
  { path: 'listar-plantillas', component: ListarPlantillasComponent , canActivate: [AuthGuard], data: { expectedRoles: ['Plantillas', 'Admin'] } },
  { path: 'editar-plantilla/:nombrePlantilla', component: EditarPlantillaComponent , canActivate: [AuthGuard], data: { expectedRoles: ['Plantillas', 'Admin'] } },
  { path: 'crear-plantilla', component:CrearPlantillaComponent, canActivate: [AuthGuard], data: { expectedRoles: ['Plantillas', 'Admin'] } },
  { path: 'crear-plantilla-seleccion', component: CrearPlantillaConSeleccionComponent, canActivate: [AuthGuard], data: { expectedRoles: ['Plantillas', 'Admin'] } },
  
  { path: 'crear-documento', component:CrearDocumentoComponent, canActivate: [AuthGuard], data: { expectedRoles: ['Capturista', 'Admin'] } },
  { path: 'editar-documento', component:EditarDocumentoComponent, canActivate: [AuthGuard], data: { expectedRoles: ['Capturista', 'Admin'] } },
  { path: 'listar-documentos', component:ListarDocumentosComponent, canActivate: [AuthGuard], data: { expectedRoles: ['Capturista', 'Admin'] } },
  
  { path: 'comentarios', component:ComentariosComponent, canActivate: [AuthGuard], data: { expectedRoles: ['Validador', 'Admin'] } },
  
  { path: 'usuarios', component:AdministrativosComponent, canActivate: [AuthGuard], data: { expectedRoles: ['Admin'] } },
  { path: 'listar-administrativos', component:ListarAdministrativosComponent, canActivate: [AuthGuard], data: { expectedRoles: ['Admin'] } },
  { path: 'editar-administrativos/:id', component:EditarAdministrativosComponent, canActivate: [AuthGuard], data: { expectedRoles: ['Admin'] } },
  { path: 'carrusel', component: CarrouselUploadComponent, canActivate: [AuthGuard], data: { expectedRoles: ['Carrusel', 'Admin'] } },
  
  { path: 'admin-login', component:AdminLoginComponent},
  { path: 'home-admin', component:HomeAdminComponent},
  {path: 'not-authorized', component:AccessDeniedComponent},
 

  ]},

  
  { path: 'user', component:UserComponent, children: [

  { path: 'login', component:LoginComponent},
  { path: 'home-user', component:HomeUserComponent},
  { path: 'registro', component:UserRegisterComponent},
  { path: 'user-profile', component: UserProfileComponent},
  { path: 'busqueda-avanzada', component:BusquedaAvanzadaComponent},
  { path: 'busqueda-sencilla', component:BusquedaSencillaComponent},
  { path: 'detalle-documento', component:DetallesDocumentoComponent},
  
  ]},
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
