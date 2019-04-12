export const data = {
  title: '某企业风电运维系统',
  key: 'FD25-100',
  name: 'FD25-100',
  label: '某企业风电运维系统',
  isLeaf: false,
  type: 'system',
  describe: '某企业风电运维系统',
  children: [
    {
      label: '风轮系统',
      name: 'RotorSystem',
      type: 'child-system',
      describe: '风轮系统',
      children: [
        {
          label: '安全速度控制系统',
          name: 'Blade-control-system',
          type: 'child-system',
          describe: '安全速度控制系统',
          children: [
            {
              label: '转速传感器控制系统',
              name: 'Speed-sensorm-control-system',
              type: 'child-system',
              describe: '转速传感器控制系统',
              children: [
                {
                  label: '转速传感器',
                  name: 'Speed-sensorm',
                  type: 'module',
                  dataType: '',
                  describe: '转速传感器',
                  title: '转速传感器',
                  key: 'Speed-sensorm',
                  isLeaf: true
                }
              ],
              title: '转速传感器控制系统',
              key: 'Speed-sensorm-control-system',
              isLeaf: false
            }
          ],
          title: '安全速度控制系统',
          key: 'Blade-control-system',
          isLeaf: false
        },
        {
          label: '叶片',
          name: 'Blade',
          type: 'module',
          describe: '',
          dataType: '',
          title: '叶片',
          key: 'Blade',
          isLeaf: true,
          children: [
            {
              name: 'Bladelcing',
              label: '叶片结冰诊断',
              version: '1.0.0',
              author: 'yc',
              describe:
                '通过对叶片相关数据进行综合建模，分析叶片污染风险程度，呈现出叶片结冰预警情况',
              businessType: '故障诊断',
              businessTypeId: 'zd',
              modelingMethod: '可视化建模',
              status: 2,
              isDeploy: false,
              checked: false,
              type: 'model'
            }
          ]
        }
      ],
      title: '风轮系统',
      key: 'RotorSystem',
      isLeaf: false
    },
    {
      label: '传动系统',
      name: 'DriveSystem',
      type: 'child-system',
      describe: '传动系统',
      children: [
        {
          label: '齿轮箱',
          name: 'Gearbox',
          type: 'module',
          describe: '齿轮箱',
          title: '齿轮箱',
          key: 'Gearbox',
          isLeaf: true,
          children: [
            {
              name: 'GearboxDiagnosis',
              label: '齿轮箱振动诊断',
              version: '1.0.0',
              author: 'yc',
              describe: '用于齿轮箱振动诊断，需要外部传感器支持',
              businessType: '故障诊断',
              businessTypeId: 'zd',
              modelingMethod: '可视化建模',
              status: 2,
              isDeploy: false,
              type: 'model'
            }
          ]
        }
      ],
      title: '传动系统',
      key: 'DriveSystem',
      isLeaf: false
    }
  ],
  expanded: true
};
