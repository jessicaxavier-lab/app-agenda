import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  peopleOutline,
  listOutline,
  reorderThreeOutline,
  personCircleOutline,
  pricetagOutline,
  callOutline,
  call,
  star,
  starOutline,
  createOutline,
  trashOutline,
  add,
  arrowBack,
  personOutline,
  personAddOutline,
  mailOutline,
  saveOutline,
  cameraOutline,
  chatbubbleOutline
} from 'ionicons/icons';

import {
  AlertController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
  IonButton,
  IonFab,
  IonFabButton,
  IonModal,
  IonButtons,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonChip,
  IonBadge,
  IonCard,
  IonCardContent,
  IonAccordion,
  IonAccordionGroup,
  IonReorder,
  IonReorderGroup,
  IonText
} from '@ionic/angular';

interface Contato {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  categoria: string;
  favorito: boolean;
  foto: string;
  ligacoesFeitas: number;
  ligacoesRecebidas: number;
}

interface Perfil {
  nome: string;
  telefone: string;
  email: string;
  frase: string;
  foto: string;
}

const CHAVE_STORAGE = 'agenda-contatos';
const CHAVE_PERFIL = 'agenda-perfil';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonIcon,
    IonButton,
    IonFab,
    IonFabButton,
    IonModal,
    IonButtons,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToast,
    IonChip,
    IonBadge,
    IonCard,
    IonCardContent,
    IonAccordion,
    IonAccordionGroup,
    IonReorder,
    IonReorderGroup,
    IonText
  ]
})
export class Tab1Page {

  contatos: Contato[] = [];

  perfil: Perfil = {
    nome: '',
    telefone: '',
    email: '',
    frase: '',
    foto: ''
  };

  termoBusca = '';
  modoOrganizacao = false;

  isModalOpen = false;
  isEditMode = false;

  isPerfilModalOpen = false;

  nomeInput = '';
  telefoneInput = '';
  emailInput = '';
  categoriaInput = 'Geral';
  fotoInput = '';

  perfilNomeInput = '';
  perfilTelefoneInput = '';
  perfilEmailInput = '';
  perfilFraseInput = '';
  perfilFotoInput = '';

  contatoEditando: string | null = null;

  isToastOpen = false;
  mensagemToast = '';

  constructor(private alertController: AlertController) {
    addIcons({
      peopleOutline,
      listOutline,
      reorderThreeOutline,
      personCircleOutline,
      pricetagOutline,
      callOutline,
      call,
      star,
      starOutline,
      createOutline,
      trashOutline,
      add,
      arrowBack,
      personOutline,
      personAddOutline,
      mailOutline,
      saveOutline,
      cameraOutline,
      chatbubbleOutline
    });

    this.carregarContatos();
    this.carregarPerfil();
  }

  get temPerfil(): boolean {
    return !!this.perfil.nome.trim();
  }

  carregarContatos() {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE);
      if (salvo) {
        const lista = JSON.parse(salvo) as Partial<Contato>[];
        this.contatos = lista.map(c => ({
          id: c.id ?? Date.now().toString(),
          nome: c.nome ?? '',
          telefone: c.telefone ?? '',
          email: c.email ?? '',
          categoria: c.categoria ?? 'Geral',
          favorito: c.favorito ?? false,
          foto: c.foto ?? '',
          ligacoesFeitas: c.ligacoesFeitas ?? 0,
          ligacoesRecebidas: c.ligacoesRecebidas ?? 0
        }));
      }
    } catch {
      this.contatos = [];
    }
  }

  carregarPerfil() {
    try {
      const salvo = localStorage.getItem(CHAVE_PERFIL);
      if (salvo) {
        const p = JSON.parse(salvo) as Partial<Perfil>;
        this.perfil = {
          nome: p.nome ?? '',
          telefone: p.telefone ?? '',
          email: p.email ?? '',
          frase: p.frase ?? '',
          foto: p.foto ?? ''
        };
      }
    } catch {
      this.perfil = { nome: '', telefone: '', email: '', frase: '', foto: '' };
    }
  }

  persistir() {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(this.contatos));
    } catch {
      this.mostrarToast('Não foi possível salvar os dados.');
    }
  }

  persistirPerfil() {
    try {
      localStorage.setItem(CHAVE_PERFIL, JSON.stringify(this.perfil));
    } catch {
      this.mostrarToast('Não foi possível salvar o perfil.');
    }
  }

  get contatosFiltrados(): Contato[] {
    const termo = this.termoBusca.toLowerCase().trim();

    return this.contatos.filter(contato =>
      contato.nome.toLowerCase().includes(termo) ||
      contato.telefone.includes(termo) ||
      contato.email.toLowerCase().includes(termo)
    );
  }

  filtrarContatos() {}

  contarFavoritos(): number {
    return this.contatos.filter(contato => contato.favorito).length;
  }

  abrirPerfil() {
    this.perfilNomeInput = this.perfil.nome;
    this.perfilTelefoneInput = this.perfil.telefone;
    this.perfilEmailInput = this.perfil.email;
    this.perfilFraseInput = this.perfil.frase;
    this.perfilFotoInput = this.perfil.foto;
    this.isPerfilModalOpen = true;
  }

  salvarPerfil() {
    if (!this.perfilNomeInput.trim()) {
      this.mostrarToast('Digite o seu nome.');
      return;
    }

    const eraNovo = !this.temPerfil;

    this.perfil = {
      nome: this.perfilNomeInput.trim(),
      telefone: this.perfilTelefoneInput.trim(),
      email: this.perfilEmailInput.trim(),
      frase: this.perfilFraseInput.trim(),
      foto: this.perfilFotoInput
    };

    this.persistirPerfil();
    this.mostrarToast(eraNovo ? 'Perfil criado!' : 'Perfil atualizado!');
    this.fecharPerfil();
  }

  fecharPerfil() {
    this.isPerfilModalOpen = false;
  }

  removerFotoPerfil() {
    this.perfilFotoInput = '';
  }

  abrirNovoContato() {
    this.limparFormulario();
    this.isEditMode = false;
    this.isModalOpen = true;
  }

  editarContato(contato: Contato) {
    this.isEditMode = true;
    this.contatoEditando = contato.id;

    this.nomeInput = contato.nome;
    this.telefoneInput = contato.telefone;
    this.emailInput = contato.email;
    this.categoriaInput = contato.categoria;
    this.fotoInput = contato.foto;

    this.isModalOpen = true;
  }

  async selecionarFoto(event: Event, alvo: 'contato' | 'perfil') {
    const campo = event.target as HTMLInputElement;
    const arquivo = campo.files?.[0];

    if (!arquivo) {
      return;
    }

    try {
      const imagem = await this.redimensionarImagem(arquivo);

      if (alvo === 'perfil') {
        this.perfilFotoInput = imagem;
      } else {
        this.fotoInput = imagem;
      }
    } catch {
      this.mostrarToast('Não foi possível carregar a foto.');
    }

    campo.value = '';
  }

  removerFoto() {
    this.fotoInput = '';
  }

  redimensionarImagem(arquivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();

      leitor.onload = () => {
        const imagem = new Image();

        imagem.onload = () => {
          const tamanhoMaximo = 256;
          const escala = Math.min(1, tamanhoMaximo / Math.max(imagem.width, imagem.height));
          const canvas = document.createElement('canvas');

          canvas.width = Math.round(imagem.width * escala);
          canvas.height = Math.round(imagem.height * escala);

          const contexto = canvas.getContext('2d');

          if (!contexto) {
            reject(new Error('canvas'));
            return;
          }

          contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };

        imagem.onerror = () => reject(new Error('imagem'));
        imagem.src = leitor.result as string;
      };

      leitor.onerror = () => reject(new Error('leitura'));
      leitor.readAsDataURL(arquivo);
    });
  }

  salvarContato() {
    if (!this.nomeInput.trim() || !this.telefoneInput.trim()) {
      this.mostrarToast('Preencha o nome e o telefone.');
      return;
    }

    if (this.isEditMode && this.contatoEditando) {
      const contato = this.contatos.find(c => c.id === this.contatoEditando);

      if (contato) {
        contato.nome = this.nomeInput.trim();
        contato.telefone = this.telefoneInput.trim();
        contato.email = this.emailInput.trim();
        contato.categoria = this.categoriaInput;
        contato.foto = this.fotoInput;
      }

      this.mostrarToast('Contato atualizado!');
    } else {
      const novoContato: Contato = {
        id: Date.now().toString(),
        nome: this.nomeInput.trim(),
        telefone: this.telefoneInput.trim(),
        email: this.emailInput.trim(),
        categoria: this.categoriaInput,
        favorito: false,
        foto: this.fotoInput,
        ligacoesFeitas: 0,
        ligacoesRecebidas: 0
      };

      this.contatos.push(novoContato);
      this.mostrarToast('Contato cadastrado!');
    }

    this.persistir();
    this.fecharModal();
  }

  alternarFavorito(contato: Contato) {
    contato.favorito = !contato.favorito;
    this.persistir();

    this.mostrarToast(
      contato.favorito
        ? 'Contato adicionado aos favoritos!'
        : 'Contato removido dos favoritos!'
    );
  }

  ligar(contato: Contato) {
    contato.ligacoesFeitas++;
    this.persistir();
    this.mostrarToast('Ligação registrada!');
    window.location.href = 'tel:' + contato.telefone;
  }

  registrarRecebida(contato: Contato) {
    contato.ligacoesRecebidas++;
    this.persistir();
    this.mostrarToast('Ligação recebida registrada!');
  }

  async excluirContato(id: string) {
    const alerta = await this.alertController.create({
      header: 'Excluir contato',
      message: 'Deseja realmente excluir este contato?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.contatos = this.contatos.filter(contato => contato.id !== id);
            this.persistir();
            this.mostrarToast('Contato excluído!');
          }
        }
      ]
    });

    await alerta.present();
  }

  reordenarContatos(event: any) {
    const contatoMovido = this.contatos.splice(event.detail.from, 1)[0];
    this.contatos.splice(event.detail.to, 0, contatoMovido);
    this.persistir();
    event.detail.complete();
  }

  fecharModal() {
    this.isModalOpen = false;
    this.limparFormulario();
  }

  limparFormulario() {
    this.nomeInput = '';
    this.telefoneInput = '';
    this.emailInput = '';
    this.categoriaInput = 'Geral';
    this.fotoInput = '';
    this.contatoEditando = null;
  }

  mostrarToast(mensagem: string) {
    this.mensagemToast = mensagem;
    this.isToastOpen = true;
  }
}