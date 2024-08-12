import Game from './engine/game';
import Data from './data/base';

import Title from './states/title';
import Help from './states/help';
import Play from './states/play';
import Win from './states/win';
import Tutorial from './states/tutorial';

import {Sprite} from './entities/sprite';
import {Text} from './entities/text';
import {Boom} from './entities/boom';
import {Particle} from './entities/particle';
import {Control} from './entities/control';
import {Spawn} from './entities/spawn';

import {Bullet} from './entities/bullet';
import {Bee} from './entities/bee';
import {Worm} from './entities/worm';
import {Eye} from './entities/eye';
import {Creep} from './entities/creep';
import {Fly} from './entities/fly';
import Bg from './entities/bg';
import Cave_bg from './entities/cave_bg';
import Cloud from './entities/cloud';
import Overlay from './entities/overlay';
import Wiper from './entities/wiper';
import {Shroom} from './entities/shroom';
import {Powerup} from './entities/powerup';
import {Spike} from './entities/spike';

const o = Data;
o.states = {
  Title,
  Help,
  Play,
  Win,
  Tutorial,
  };
o.ents = {
  Sprite,
  Text,
  Spawn,
  Boom,
  Particle,
  Control,
  Bullet,
  Bee,
  Worm,
  Eye,
  Creep,
  Fly,
  Bg,
  Cave_bg,
  Cloud,
  Shroom,
  Powerup,
  Overlay,
  Wiper,
  Spike,
};

new Game(o);
