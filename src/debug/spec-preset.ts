/// <reference path='../../typings/index.d.ts' />
require('source-map-support').install();

// jasmine 테스트를 위한 프리셋
import * as express from 'express';
let app = express();

export let preset = {app};