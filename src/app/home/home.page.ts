import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, fromEvent, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Confirm, Notify } from 'notiflix';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public searchedTool: any = new FormControl('');
  public tools: Tool[] = [];
  public showModalAdd = false;
  public tool: Observable<any>;
  public sub = new Subscription();
  public isChecked = false;
  public newTool = {
    newTitle: '',
    newLink: '',
    newDescription: '',
    newTags: ''
  };

  constructor(private http: HttpClient) { }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit() {
    this.http.get(`http://localhost:3000/tools`).subscribe(r => {
      this.tools = Object.assign(this.tools, r);
    });

    this.searchedTool.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.getTool();
    });
  }

  getTool() {
    if (this.isChecked) {
      this.http.get(`http://localhost:3000/tools?tags_like=${this.searchedTool.value}`).subscribe((r: any) => {
        this.tools = r;
      });
    } else {
      this.http.get(`http://localhost:3000/tools?q=${this.searchedTool.value}`).subscribe((r: any) => {
        this.tools = r;
      });
    }
  }

  showModal() {
    this.showModalAdd = !this.showModalAdd;
  }

  addTool() {
    if (this.newTool.newTitle !== '' && this.newTool.newDescription !== '' && this.newTool.newLink !== '') {

      const payload = {
        id: 0,
        title: `${this.newTool.newTitle}`,
        link: `${this.newTool.newLink}`,
        description: `${this.newTool.newDescription}`,
        tags: this.newTool.newTags.split(' ')
      };

      this.http.post(`http://localhost:3000/tools`, payload).subscribe(r => {
        this.newTool = {
          newTitle: '',
          newLink: '',
          newDescription: '',
          newTags: ''
        };
        this.tools.push(payload);
        this.showModal();
        Notify.success('Tool added successfully');
      });
    } else {
      Notify.failure('You need to fill all the fields');
    }
  }

  removeTool(id) {
    Confirm.show(
      'Are you sure?',
      'Do you really want to remove this tool?',
      'Yes',
      'No',
      () => {
        Notify.success('Tool deleted successfully');
        this.http.delete(`http://localhost:3000/tools/${id}`).subscribe(r => {
          this.tools = this.tools.filter(tool => tool.id !== id);
        });
      });
  }
}

export interface Tool {
  id: number;
  title: string;
  link: string;
  description: string;
  tags: string[];
}
