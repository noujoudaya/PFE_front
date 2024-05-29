import {Component, OnInit} from '@angular/core';
import {BulletinPaie} from "../../../../services/models/bulletin-paie.model";
import {BulletinPaieService} from "../../../../services/services/bulletin-paie.service";
import {NgForOf} from "@angular/common";
import {BulletinPaieRubrique} from "../../../../services/models/bulletin-paie-rubrique.model";


@Component({
  selector: 'app-bulletin-paie-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './bulletin-paie-list.component.html',
  styleUrl: './bulletin-paie-list.component.scss'
})
export class BulletinPaieListComponent implements OnInit{
  bps:BulletinPaieRubrique[]=[];
   bulletinPaieRubs: Array<BulletinPaieRubrique> = [];
  constructor(private bulletinPaieService: BulletinPaieService,) {


  }
    ngOnInit(): void {
this.findAll()
    }


  public findAll(): void {
    this.bulletinPaieService.findAll().subscribe(data => {
      console.log(data);
this.bulletinPaies=data.reverse();
    });
  }
  upload(code: number) {
    console.log(code);
    this.bulletinPaieService.findPdf(code).subscribe((pdfBlob: Blob) => {
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Bulletin_${code}.pdf`;
      link.click();
    });
  }


  get bulletinPaie(): BulletinPaie {
    return this.bulletinPaieService.bulletinPaie;
  }

  set bulletinPaie(value: BulletinPaie) {
    this.bulletinPaieService.bulletinPaie = value;
  }

  get bulletinPaies(): Array<BulletinPaie> {
    return this.bulletinPaieService.bulletinPaies;
  }

  set bulletinPaies(value: Array<BulletinPaie>) {
    this.bulletinPaieService.bulletinPaies = value;
  }





  deleteByCode(bp: BulletinPaie, i: number) {

  }
}
