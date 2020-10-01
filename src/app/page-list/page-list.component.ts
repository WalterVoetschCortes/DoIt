import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToDo } from '../_interface/todo';
import { EventPing } from '../_interface/eventping';
import {DataService} from '../_service/data.service';
import {Subscription} from 'rxjs';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.sass']
})
export class PageListComponent implements OnInit, OnDestroy {

  public toDoShow: boolean;
  public toDoDoneShow: boolean;

  public $todos: ToDo[];
  public $todosdone: ToDo[];

  public subs = new Subscription();

  constructor(
    // tslint:disable-next-line:variable-name
    public _dataService: DataService,
    // tslint:disable-next-line:variable-name
    public _dragulaService: DragulaService
  ) {
    this.toDoShow = true;
    this.toDoDoneShow = false;
    this.$todos = [];
    this.$todosdone = [];
    this.loadData();

    this._dragulaService.createGroup('todos', {
      removeOnSpill: false
    });

    this.subs.add(_dragulaService.drop('todos')
      .subscribe(({ el }) => {
        this.position();
      })
    );
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public position(): void {
    console.log(`%cFUNC: position()`, `color: white; background-color: black`);
    let position = 0;
    this.$todos.forEach((todo: ToDo) => {
      position += 1;
      todo.position = position;
      // @ts-ignore
      this._dataService.putToDo(todo).subscribe((data: ToDo) => {
        console.log(`%cSUC: ${data.label} wurde neu positioniert.`, `color: green`);
      }, error => {
        console.log(`%cERROR: ${error.message}`, `color: red; font-size: 12px;`);
      });
    });
  }

  public loadData(): void {
    this.$todosdone = [];
    this.$todos = [];
    this._dataService.getToDo().subscribe((data: ToDo[]) => {
      data.forEach((toDo: ToDo) => {
        if (toDo.status === true) {
          this.$todosdone.push(toDo);
        } else {
          this.$todos.push(toDo);
        }
      });
      this.$todos.sort((obj1, obj2) => {
        return obj1.position - obj2.position;
      });
    }, error => {
      console.log(`%cERROR: ${error.message}`, `color: red; font-size: 12px;`);
    });
  }

  public create(event: ToDo): void {
    event.position = this.$todos.length + 1;
    this._dataService.postToDo(event).subscribe((data: ToDo[]) => {
      console.log(`%cSUC: "$(data.label)" wurde erfolgreich erstellt.`, `color: green;`);
      // @ts-ignore
      this.$todos.push(data);
      this.position();
    }, error => {
      console.log(`%cERROR: ${error.message}`, `color: red; font-size: 12px;`);
    });
  }

  public update(event: EventPing): void{
    if ('check' === event.label){
      console.log('%c"$(event.label)-Event" wurde getriggert. `, `color: green;');
      if (!event.object.status){
        this.$todosdone.splice(this.$todosdone.indexOf(event.object), 1);
        this.$todos.push(event.object);
      } else {
        this.$todos.splice(this.$todos.indexOf(event.object), 1);
        this.$todosdone.push(event.object);
      }
    }
    if ('delete' === event.label){
      console.log('%c"$(event.label)-Event" wurde getriggert. `, `color: green;');
      if (event.object.status){
        this.$todosdone.splice(this.$todosdone.indexOf(event.object), 1);
      } else {
        this.$todos.splice(this.$todos.indexOf(event.object), 1);
      }
    }
    if ('label' === event.label){
      console.log('%c"$(event.label)-Event" wurde getriggert. `, `color: green;');
      if (event.object.status){
        this.$todosdone.forEach((toDo: ToDo) => {
          // tslint:disable-next-line:triple-equals
          if (toDo.id == event.object.id) {
            toDo.label = event.object.label;
          }
        });
      } else {
        this.$todos.forEach((toDo: ToDo) => {
          // tslint:disable-next-line:triple-equals
          if (toDo.id == event.object.id) {
            toDo.label = event.object.label;
          }
        });
      }
    }
  }
}
