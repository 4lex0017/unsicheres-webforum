import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Thread} from "../models/thread";
import {Category} from "../models/category";
import {Access} from "../models/access";


@Injectable({
  providedIn: 'root',
})
export class BackendService {
  readonly url: string = 'http://localhost:4200';

  constructor(private httpClient: HttpClient) {}

  loadBoard(): Access{
    return this.data;
  }

   data =
    {
    "categories":[
      {
        "id": 1,
        "title": "Community",
        "threads": [
          {
            "id": 1,
            "title": "Community Thread 1",
            "endorsements": 15,
            "author":
              {
                "id": 1,
                "username": "TestUsername1"
              },
            "posts":[
              {
                "id": 1,
                "content": "this is a test post",
                "author":
                  {
                    "id": 2,
                    "username": "TestUsername2"
                  }
              }
            ]
          },
          {
            "id": 2,
            "title": "Community 2",
            "endorsements": 33,
            "author":
              {
                "id": 2,
                "username": "TestUsername2"
              },
            "posts":[
              {
                "id": 3,
                "content": "this is a test post2",
                "author":
                  {
                    "id": 3,
                    "username": "TestUsername3"
                  }
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "title": "Genreal",
        "threads": [
          {
            "id": 5,
            "title": "Genreal 1",
            "endorsements": 1,
            "author":
              {
                "id": 1,
                "username": "TestUsername1"
              },
            "posts":[
              {
                "id": 1,
                "content": "this is a test post",
                "author":
                  {
                    "id": 2,
                    "username": "TestUsername2"
                  }

              }
            ]
          },
          {
            "id": 7,
            "title": "General 2",
            "endorsements": 0,
            "author":
              {
                "id": 4,
                "username": "TestUsername4"
              },
            "posts":[
              {
                "id": 33,
                "content": "this is a test post33",
                "author":
                  {
                    "id": 553,
                    "username": "TestUsername553"
                  }
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "title": "Support",
        "threads": []
      }
    ]
  };

}
