import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ServService} from './../../serv.service'
import { UsuarioService } from 'src/app/shared/usuario.service';
import { Usuario } from './../../models/usuario';
import { LoginService } from 'src/app/shared/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  closeResult = '';
  public usuarioActual=new Usuario(null,null,null,null,null,null,null,null,null)
  

  constructor(public usuarioService:UsuarioService, public loginService:LoginService, private modalService: NgbModal) { 
    this.usuarioActual=this.loginService.usuarioActual
    }

  ngOnInit(): void {
    this.usuarioActual=this.loginService.usuarioActual
  }

  onSubmit(form){
    console.log(form.value)
  }

  modificarUsuario(idUsuario:number, name:string, password:string, email:string, comunidad:string, provincia:string, localidad:string, cp:number, user_image:string){
    console.log('Usuario Modificado')
    let userUpdated = new Usuario(idUsuario, name, password, email, comunidad, provincia, localidad, cp, user_image);
    this.usuarioService.putUsuario(userUpdated).subscribe((data)=>{
      console.log(data)
    })
    this.usuarioActual = userUpdated;
  }

  borrarUsuario(id:number){
    console.log('Usuario Borrado')
    this.usuarioService.deleteUsuario(id).subscribe((data)=>{
      console.log(data)
    })
  }

  open3(content3) {
    this.modalService.open(content3, {ariaLabelledBy: 'modalEliminarCuenta'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    }  else {
      return '';
    }
  }
}
