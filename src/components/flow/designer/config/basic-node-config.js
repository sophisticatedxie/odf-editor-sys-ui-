export const tools = [{
    type: 'drag',
    icon: 'drag',
    name: '拖拽'
  },
  {
    type: 'connection',
    icon: 'fork',
    name: '连线'
  },
  {
    type: 'zoom-in',
    icon: 'zoom-in',
    name: '放大'
  },
  {
    type: 'zoom-out',
    icon: 'zoom-out',
    name: '缩小'
  }
];

export const commonNodes = [{
  type: 'start',
  nodeName: 'body',
  icon: 'StartIcon'
}];

export const highNodes = [{
    type: 'child-flow',
    nodeName: 'Competition',
    icon: 'ChildFlowIcon',
    autoField: '',
  },
  {
    type: 'end',
    nodeName: 'Session',
    icon: 'EndIcon',
    autoField: ''
  },
  {
    type: 'common',
    nodeName: 'Unit',
    icon: 'CommonIcon',
    autoField: ''
  },
  {
    type: 'freedom',
    nodeName: 'StartText',
    icon: 'FreedomIcon',
    autoField: ''
  },
  {
    type: 'gateway',
    nodeName: 'ItemName',
    icon: 'GatewayIcon',
    autoField: ''
  },
  {
    type: 'event',
    nodeName: 'VenueDescription',
    icon: 'EventIcon',
    autoField: ''
  }
];

export const laneNodes = [{
    type: 'x-lane',
    nodeName: 'CompetitionCode',
    icon: 'FreedomIcon'
  },
  {
    type: 'y-lane',
    nodeName: 'DocumentCode',
    icon: 'FreedomIcon'
  },
  {
    type: 'y-lane',
    nodeName: 'DocumentType',
    icon: 'FreedomIcon'
  }
];
