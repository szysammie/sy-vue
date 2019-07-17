<template>
  <div>
    <el-row>
      <el-col :span="2">
        <el-button type="primary" style="margin-top: 10px" @click="newContract">新增</el-button>
      </el-col>
      <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-ruleForm">
        <el-col :span="6" :offset="6" style="margin-top: 10px">
          <el-form-item label="合同名称：" prop="contractName">
            <el-input v-model="searchForm.contractName"/>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="primary" style="margin-left: -70px;margin-top: 10px" @click="search">查找</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%;height: 100%">
      <el-table-column
        prop="number"
        label="序号"
        :span="2"
        align="center">
      </el-table-column>
      <el-table-column
        prop="reportNum"
        label="审批序号"
        :span="4"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contractName"
        label="合同名称"
        :span="4"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contractAmount"
        label="合同金额(万元)"
        :span="4"
        align="center">
      </el-table-column>
      <el-table-column
        prop="beginDateString"
        label="开始时间"
        :span="4"
        align="center">
      </el-table-column>
      <el-table-column
        prop="endDateString"
        label="结束时间"
        :span="4"
        align="center">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        width="400">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click.native.prevent="operation(scope.$index, tableData)">申请</el-button>
          <el-button type="warning" size="mini" @click.native.prevent="analysis(scope.row)">分析</el-button>
          <el-button type="info" size="mini" @click.native.prevent="analysisInfo(scope.row.projectId)">明细</el-button>
          <el-button type="danger" size="mini" @click.native.prevent="deleteContract(scope.row.projectId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--弹窗,单个分析-->
    <el-dialog
      title="成本分析可视化展示"
      :visible.sync="Visible"
      :before-close="handleClose"
      width="90%"
    >

      <el-row :gutter="24">
        <el-col :span="6">
          <el-form ref="form" :model="form" label-width="120px">
            <p>科室:
              <el-select v-model="value" placeholder="请选择" @change="changeDap">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </p>

            <p>报审序号 :
              <el-select v-model="reportNum" placeholder="请选择" @change="getOneInfo">
                <el-option
                  v-for="item in reportNumData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </p>
            <p>合同相对人  : {{temp.contractPerson}}</p>
            <p>合同金额(万元)  : {{temp.contractAmount}}</p>
            <p>累计工作量(万元)  : {{temp.workLoad}}</p>
            <p>开始日期  : {{temp.beginDateString}}</p>
            <p>结束日期  : {{temp.endDateString}}</p>
            <p>工资(万元)  :  {{temp.salary}}</p>
            <p>差旅费(万元)  :  {{temp.travelPay}}</p>
            <p>车辆费用(万元)  : {{temp.carsPay}}</p>
            <p>设备费用(万元)  : {{temp.equipPay}}</p>
            <p>耗材费用(万元)  : {{temp.materialPay}}</p>
            <p>外协费用(万元)  : {{temp.assistPay}}</p>
            <p>管理费用(万元)  : {{temp.managePay}}</p>
            <p>其他(万元)  : {{temp.otherPay}}</p>
            <el-tag type="warning">利润(万元)  : {{temp.profit}}</el-tag>
            <p>备注  : {{temp.notes}}</p>
          </el-form>
        </el-col>
        <el-col :span="9">
          <el-card>
            <div ref="gccb_Box" class="chart-box" style="height: 600px"></div>
          </el-card>
        </el-col>
        <el-col :span="9">
          <el-card>
            <div ref="gclr_Box" class="chart-box" style="height: 600px"></div>
          </el-card>
        </el-col>
      </el-row>

    </el-dialog>
    <!--弹窗，分析详情-->
    <el-dialog
      title="费用明细"
      :visible.sync="analysisVisible"
      width="80%"
    >
      <el-tabs v-model="activeName1" type="card" @tab-click="handleClick1">
        <el-tab-pane label="人员费用" name="0">
          <el-table
            :data="peoplePay"
            stripe
            style="width: 100%">
            <el-table-column
              fixed
              prop="contractName"
              label="合同名称"
              align="center"
              :spam="2"/>
            <el-table-column
              label="人员"
              align="center"
              :span="2">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="warning">{{ scope.row.staffName }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="beginDateString"
              label="开始日期"
              align="center"
              :span="2"/>
            <el-table-column
              prop="endDateString"
              label="结束日期"
              align="center"
              :span="2"/>
            <el-table-column
              prop="unitPrice"
              label="差旅费(万元/天)"
              align="center"
              :span="2"/>
            <el-table-column
              prop="amount"
              label="差旅费总额(万元)"
              align="center"
              :span="2"/>
            <el-table-column
              prop="dayPay"
              align="center"
              label="工资(万元/天)"
              :span="2"/>
            <el-table-column
              prop="pay"
              label="工资总额(万元)"
              align="center"
              fixed="right"
              :span="2"/>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="车辆费用" name="1">
          <el-table
            :data="carPay"
            stripe
            style="width: 100%">
            <el-table-column
              fixed
              prop="contractName"
              label="合同名称"
              align="center"
              :spam="2"/>
            <el-table-column
              label="申请人"
              align="center"
              :span="2">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.creater }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="车牌号"
              align="center"
              :span="2">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="warning">{{ scope.row.vehicleNum }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="beginDateString"
              label="开始日期"
              align="center"
              :span="2"/>
            <el-table-column
              prop="endDateString"
              label="结束日期"
              align="center"
              :span="2"/>
            <el-table-column
              prop="meter"
              label="公里数"
              align="center"
              :span="2"/>
            <el-table-column
              prop="totalPrice"
              align="center"
              label="总费用(万元)"
              :span="2"/>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="设备费用" name="2">
          <el-table
            :data="equipPay"
            stripe
            style="width: 100%">
            <el-table-column
              fixed
              prop="contractName"
              label="合同名称"
              align="center"
              :spam="2"/>
            <el-table-column
              label="申请人"
              align="center"
              :span="2">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="warning">{{ scope.row.creater }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="beginDateString"
              label="开始日期"
              align="center"
              :span="2"/>
            <el-table-column
              prop="endDateString"
              label="结束日期"
              align="center"
              :span="2"/>
            <el-table-column
              prop="equipName"
              label="设备名称"
              align="center"
              :span="2"/>
            <el-table-column
              prop="equipType"
              label="设备型号"
              align="center"
              :span="2"/>

            <el-table-column
              prop="totalPrice"
              label="总金额(万元)"
              align="center"
              fixed="right"
              :span="2"/>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="材料费用" name="3">
          <el-table
            :data="materPay"
            stripe
            style="width: 100%">
            <el-table-column
              fixed
              prop="contractName"
              label="合同名称"
              align="center"
              :spam="2"/>
            <el-table-column
              label="申请人"
              align="center"
              :span="2">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.creater }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="applyTimeString"
              label="申请日期"
              align="center"
              :span="2"/>
            <el-table-column
              prop="materialName"
              label="材料名称"
              align="center"
              :span="2"/>
            <el-table-column
              prop="brand"
              label="品牌"
              align="center"
              :span="2"/>
            <el-table-column
              prop="materialType"
              label="材料型号"
              align="center"
              :span="2"/>
            <el-table-column
              prop="unitPrice"
              label="单价(元)"
              align="center"
              :span="2"/>
            <el-table-column
              prop="count"
              label="数量"
              align="center"
              :span="2"/>

            <el-table-column
              prop="totalPrice"
              label="总金额(万元)"
              align="center"
              fixed="right"
              :span="2"/>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="外协费用" name="4">
          <el-table
            :data="assisPay"
            stripe
            style="width: 100%">
            <el-table-column
              fixed
              prop="contractName"
              label="合同名称"
              align="center"
              :spam="2"/>
            <el-table-column
              label="创建人"
              align="center"
              :span="2">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.creater }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="signTimeString"
              label="签署日期"
              align="center"
              :span="2"/>
            <el-table-column
              prop="signUnit"
              label="签署单位"
              align="center"
              :span="2"/>

            <el-table-column
              prop="price"
              label="金额(万元)"
              align="center"
              fixed="right"
              :span="2"/>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="其他费用" name="5">
          <el-table
            :data="otherPay"
            stripe
            style="width: 100%">
            <el-table-column
              fixed
              prop="contractName"
              label="合同名称"
              align="center"
              :spam="2"/>
            <el-table-column
              label="创建人"
              align="center"
              :span="2">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.creater }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="applyDateString"
              label="申请日期"
              align="center"
              :span="2"/>
            <el-table-column
              prop="feeName"
              label="描述"
              align="center"
              :span="2"/>

            <el-table-column
              prop="price"
              label="金额(万元)"
              align="center"
              fixed="right"
              :span="2"/>
          </el-table>
        </el-tab-pane>
      </el-tabs>


    </el-dialog>
    <!--最外层申请的弹窗-->
    <el-dialog
      title="出差申请"
      :visible.sync="dialogVisible"
      width="30%"
      :fullscreen="true">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="人员" name="first">
          <el-button @click="newPerson()" type="primary" style="margin-top: 5px;margin-left: 20px;margin-bottom: 8px">新增</el-button>
          <el-table
            :data="personData"
            border
            style="width: 100%;height: 100%">
            <el-table-column
              prop="number"
              label="序号"
              width="120"
              fixed
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="groupNum"
              label="所属小组"
              width="120"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="staffName"
              label="出差人"
              width="120"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="beginDateString"
              label="开始日期"
              width="120"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="endDateString"
              label="结束日期"
              width="120"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="pay"
              label="工资(万元)"
              width="140"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="amount"
              label="差旅费(万元)"
              align="center"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="creater"
              label="申请人"
              width="140"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="notes"
              label="备注"
              width="140"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="250"
              fixed="right"
            >
              <template slot-scope="scope0">
                <el-button type="primary"  @click.native.prevent="personDelete(scope0.$index, personData)">删除</el-button>
                <el-button type="primary"  @click.native.prevent="personUpdate(scope0.$index, personData)">更新</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="车辆" name="second">
          <el-button @click="newVehicle()" type="primary"  style="margin-top: 5px;margin-left: 20px;margin-bottom:5px ">新增</el-button>
          <el-table
            :data="vehicleData"
            border
            style="width: 100%;height: 100%">
            <el-table-column
              prop="number"
              label="序号"
              width="80"
              fixed
              align="center">
            </el-table-column>
            <el-table-column
              prop="groupNum"
              label="所属小组"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              prop="beginDateString"
              label="开始日期"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="endDateString"
              label="结束日期"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="meter"
              label="公里数"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              prop="vehicleNum"
              label="车牌号"
              width="160"
              align="center">
            </el-table-column>
            <el-table-column
              prop="totalPrice"
              label="金额(万元)"
              width="150"
              align="center">
            </el-table-column>
            <el-table-column
              prop="creater"
              label="申请人"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              prop="notes"
              label="备注"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              width="200"
              fixed="right"
            align="center">
              <template slot-scope="scope1">
                <el-button type="primary"  @click.native.prevent="deleteVehicle(scope1.$index, vehicleData)">删除</el-button>
                <el-button type="primary"  @click.native.prevent="updateVehicle(scope1.$index, vehicleData)">更新</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="设备" name="third">
          <el-button type="primary"  @click="newEquipment()" style="margin-top: 5px;margin-left: 20px;margin-bottom: 5px">新增</el-button>
          <el-table
            :data="equipmentData"
            border
            style="width: 100%;height: 100%">
            <el-table-column
              prop="number"
              label="序号"
              width="80"
              fixed
              align="center">
            </el-table-column>
            <el-table-column
              prop="equipName"
              label="设备名称"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="equipType"
              label="设备类型"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="equipModel"
              label="设备型号"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="factoryNum"
              label="出厂编码"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="beginDateString"
              label="开始日期"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="endDateString"
              label="结束日期"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="originalPrice"
              label="单价(元)"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="totalPrice"
              label="总金额（万元）"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              prop="dayDepreciation"
              label="天折旧（元）"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              width="160"
              fixed="right">
              <template slot-scope="scope2">
                <el-button type="primary"  size="mini" @click.native.prevent="equipmentDelete(scope2.$index, equipmentData)">删除</el-button>
                <el-button type="primary" size="mini"  @click.native.prevent="equipmentUpdate(scope2.$index, equipmentData)">更新</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="材料" name="fourth">
          <el-button type="primary" @click="newMaterial()" style="margin-top: 5px;margin-left: 20px;margin-bottom: 5px">新增</el-button>
          <el-table
            :data="materialData"
            border
            style="width: 100%;height: 100%">
            <el-table-column
              prop="number"
              label="序号"
              width="80"
              fixed
              align="center">
            </el-table-column>
            <el-table-column
              prop="groupNum"
              label="所属小组"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="materialName"
              label="材料名称"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="brand"
              label="品牌"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="materialType"
              label="材料类型"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="applyTimeString"
              label="申请日期"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="unitPrice"
              label="单价(元)"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="count"
              label="数量"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="unit"
              label="计量单位"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="totalPrice"
              label="金额（万元）"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="creater"
              label="申请人"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="checkStatus"
              label="审核状态"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="auditPerson"
              label="审核人"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="auditOpinion"
              label="审核意见"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              prop="notes"
              label="备注"
              width="140"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              width="200"
              fixed="right">
              <template slot-scope="scope3">
                <el-button type="primary" size="mini" @click.native.prevent="materialDelete(scope3.$index, materialData)">删除</el-button>
                <el-button type="primary" size="mini" @click.native.prevent="materialUpdate(scope3.$index, materialData)">更新</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="其他" name="fifth">
          <el-button  type="primary" @click="newOther()" style="margin-top: 5px;margin-left: 20px;margin-bottom: 5px">新增</el-button>
          <el-table
            :data="otherData"
            border
            style="width: 100%;height: 100%">
            <el-table-column
              prop="number"
              label="序号"
              :span="2"
              align="center">
            </el-table-column>
            <el-table-column
              prop="groupNum"
              label="所属小组"
              :span="4"
              align="center">
            </el-table-column>
            <el-table-column
              prop="applyDateString"
              label="申请日期"
              :span="4"
              align="center">
            </el-table-column>
            <el-table-column
              prop="feeName"
              label="费用描述"
              :span="4"
              align="center">
            </el-table-column>
            <el-table-column
              prop="price"
              label="金额(万元)"
              :span="4"
              align="center">
            </el-table-column>
            <el-table-column
              prop="creater"
              label="申请人"
              :span="4"
              align="center">
            </el-table-column>
            <el-table-column
              prop="notes"
              label="备注"
              :span="4"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              :span="4">
              <template slot-scope="scope4">
                <el-button type="primary" size="mini"   @click.native.prevent="deleteOther(scope4.$index, otherData)">删除</el-button>
                <el-button type="primary" size="mini"  @click.native.prevent="updateOther(scope4.$index, otherData)">更新</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="外协合同" name="sixth">
          <el-button  type="primary" @click="newOutContract()" style="margin-top: 5px;margin-left: 20px;margin-bottom: 5px">新增</el-button>
          <el-table
            :data="outContractData"
            size="mini"
            stripe
            style="width: 100%;height: 100%">
            <el-table-column
              prop="number"
              label="序号"
              fixed
              align="center"
              :span="1">
            </el-table-column>
            <el-table-column
              prop="reportNum"
              label="审批序号"
              align="center"
              :span="2"/>
            <el-table-column
              prop="contractName"
              :span="2"
              align="center"
              label="合同名称"/>
            <el-table-column
              prop="contractName"
              :span="2"
              align="center"
              label="外协合同名称"/>
            <el-table-column
              prop="signUnit"
              :span="2"
              align="center"
              label="签署单位"/>
            <el-table-column
              prop="signTimeString"
              :span="2"
              align="center"
              label="签署时间"/>
            <el-table-column
              prop="price"
              :span="2"
              align="center"
              label="金额(万元)"/>

            <el-table-column
              prop="creater"
              :span="2"
              align="center"
              label="创建人"/>
            <el-table-column
              prop="notes"
              :span="3"
              align="center"
              label="备注"/>
            <el-table-column
              width="150"
              label="操作"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button type="warning" size="small" @click="edit(scope.row)">修改</el-button>
                <el-button type="danger" size="small" @click="deleteInfo(scope.row.assistContractID)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--新增合同弹窗-->
    <el-dialog title="新增模拟合同" :visible.sync="newContractDialog">
      <el-form :model="newP" label-width="100px">
        <el-form-item label="审批序号">
          <el-input v-model="newP.reportNum"></el-input>
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="newP.contractName"></el-input>
        </el-form-item>
        <el-form-item label="合同相对人">
          <el-input v-model="newP.contractPerson"></el-input>
        </el-form-item>
        <el-form-item label="合同金额(万元)">
          <el-input v-model="newP.contractAmount"></el-input>
        </el-form-item>
        <el-form-item label="累计价值(万元)">
          <el-input v-model="newP.workLoad"></el-input>
        </el-form-item>
        <el-form-item label="合同时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="合同开始时间"
                            value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                            :clearable="false" v-model="newP.beginDateString" style="width: 100%;">
            </el-date-picker>
          </el-col>
          <el-col class="line" :span="1">&nbsp;至</el-col>
          <el-col :span="11">
            <el-date-picker placeholder="合同结束时间"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            :clearable="false" v-model="newP.endDateString" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="newP.notes"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newContractDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmNewContract">确 定</el-button>
      </div>
    </el-dialog>
    <!--新增人员弹窗-->
    <el-dialog title="申请出差人员" :visible.sync="newPersonDialog" :modal="false">
      <el-form :model="newPersonForm" ref="newPersonForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="报审序号" prop="reportNum">
          <el-input v-model="newPersonForm.reportNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="newPersonForm.contractName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="出差人员" prop="staffName">
          <el-button type="text" @click="getPerson">选择出差人员</el-button>
          <div v-for="(person,index) in multipleSelection" :key="index">{{person.staffName}}</div>
        </el-form-item>
        <el-form-item prop="beginDateString" label="出差日期">
          <el-date-picker v-model="newPersonForm.beginDateString" value-format="yyyy-MM-dd" @change="getPersonTips" type="date" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item prop="endDateString" label="预计结束日期">
          <el-date-picker v-model="newPersonForm.endDateString" value-format="yyyy-MM-dd" @change="getPersonTips" type="date" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="工资（万元）" prop="pay">
          <el-input v-model="newPersonForm.pay" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="差旅费（万元）" prop="amount">
          <el-input v-model="newPersonForm.amount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="creater">
          <el-input v-model="newPersonForm.creater" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="newPersonForm.notes"></el-input>
        </el-form-item>
        <el-form-item label="所属小组" prop="groupNum">
          <el-select v-model="newPersonForm.groupNum" placeholder="请选择小组">
            <el-option label="1组" value="1"></el-option>
            <el-option label="2组" value="2"></el-option>
            <el-option label="3组" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newPersonDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmNewPerson">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除人员弹窗-->
    <el-dialog
      title="出差申请"
      :visible.sync="dialogPerson"
      width="30%"
      :modal="false">
      <span>你是否确认删除</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPerson = false">取 消</el-button>
          <el-button type="primary" @click="confirmPersonDelete()">确 定</el-button>
        </span>
    </el-dialog>
    <!--结束出差弹窗-->
    <el-dialog
      title="结束出差人员"
      :visible.sync="dialogPersonEnd"
      width="30%"
      :modal="false">
      <span>你是否确认结束</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPersonEnd = false">取 消</el-button>
          <el-button type="primary" @click="confirmPersonEnd()">确 定</el-button>
        </span>
    </el-dialog>
    <!--更新出差人员弹窗-->
    <el-dialog title="修改出差人员" :visible.sync="updatePersonDialog" :modal="false">
      <el-form :model="newPersonForm" ref="newPersonForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="报审序号" prop="reportNum">
          <el-input v-model="newPersonForm.reportNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="newPersonForm.contractName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="出差人员" prop="staffName">
          <el-button type="text" @click="getPerson">选择出差人员</el-button>
          <div>{{newPersonForm.staffName}}</div>
        </el-form-item>
        <el-form-item prop="beginDateString" label="出差日期">
          <el-date-picker v-model="newPersonForm.beginDateString" @change="getPersonTips2" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item prop="endDateString" label="预计结束日期">
          <el-date-picker v-model="newPersonForm.endDateString" @change="getPersonTips2" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="工资（万元）" prop="pay">
          <el-input v-model="newPersonForm.pay" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="差旅费（万元）" prop="amount">
          <el-input v-model="newPersonForm.amount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="creater">
          <el-input v-model="newPersonForm.creater" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="newPersonForm.notes"></el-input>
        </el-form-item>
        <el-form-item label="所属小组" prop="groupNum">
          <el-select v-model="newPersonForm.groupNum" placeholder="请选择小组">
            <el-option label="1组" value="1"></el-option>
            <el-option label="2组" value="2"></el-option>
            <el-option label="3组" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批结果" prop="checkStatus">
          <el-input v-model="newPersonForm.checkStatus" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatePersonDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmPersonUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!--未出差人员弹窗-->
    <el-dialog
      title="未出差人员"
      :visible.sync="businessPersonDialog"
      width="30%">
      <el-row>
        <el-form ref="searchPersonForm" :model="searchPersonForm" label-width="100px" class="demo-ruleForm">
          <el-col :span="12" :offset="4" style="margin-top: 10px">
            <el-form-item label="员工名称：" prop="staffName">
              <el-input v-model="searchPersonForm.staffName"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button style="margin-left: -70px;margin-top: 10px" @click="searchPerson">查找</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="persons"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="staffName"
          label="员工姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="staffTypeString"
          label="员工类别"
        >
        </el-table-column>
        <el-table-column
          prop="departmentString"
          label="所属科室"
        >
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelChoosePerson()">取 消</el-button>
          <el-button type="primary" @click="confirmChoosePerson()">确 定</el-button>
        </span>
    </el-dialog>
    <!--新增车辆弹窗-->
    <el-dialog title="申请出差车辆" :visible.sync="newVehicleDialog" :modal="false">
      <el-form :model="newVehicleForm" ref="newVehicleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="报审序号" prop="reportNum">
          <el-input v-model="newVehicleForm.reportNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="newVehicleForm.contractName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="beginDateString" label="出差日期">
          <el-date-picker v-model="newVehicleForm.beginDateString" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;" @change="vehicleCost"/>
        </el-form-item>
        <el-form-item prop="endDateString" label="预计结束日期">
          <el-date-picker v-model="newVehicleForm.endDateString" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;" @change="vehicleCost"/>
        </el-form-item>
        <el-form-item label="车牌号" prop="vehicleNum">
          <el-input v-model="newVehicleForm.vehicleNum" ></el-input>
        </el-form-item>
        <el-form-item label="公里数 " prop="meter">
          <el-input v-model="newVehicleForm.meter" @change="vehicleCost" ></el-input>
        </el-form-item>
        <el-form-item label="金额(万元)" prop="totalPrice">
          <el-input v-model="newVehicleForm.totalPrice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="creater">
          <el-input v-model="newVehicleForm.creater" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属小组" prop="groupNum">
          <el-select v-model="newVehicleForm.groupNum" placeholder="请选择小组">
            <el-option label="1组" value="1"></el-option>
            <el-option label="2组" value="2"></el-option>
            <el-option label="3组" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="newVehicleForm.notes"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newVehicleDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmNewVehicle">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除车辆申请弹窗-->
    <el-dialog
      title="车辆申请"
      :visible.sync="dialogVehicle"
      width="30%"
      :modal="false">
      <span>你是否确认删除</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVehicle = false">取 消</el-button>
          <el-button type="primary" @click="confirmDeleteVehicle()">确 定</el-button>
        </span>
    </el-dialog>
    <!--更新车辆申请弹窗-->
    <el-dialog title="修改出差车辆" :visible.sync="updateVehicleDialog" :modal="false">
      <el-form :model="newVehicleForm" ref="newVehicleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="报审序号" prop="reportNum">
          <el-input v-model="newVehicleForm.reportNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="newVehicleForm.contractName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="beginDateString" label="出差日期">
          <el-date-picker v-model="newVehicleForm.beginDateString" type="date" placeholder="选择日期" style="width: 100%;" @change="vehicleCost"/>
        </el-form-item>
        <el-form-item prop="endDateString" label="预计结束日期">
          <el-date-picker v-model="newVehicleForm.endDateString" type="date" placeholder="选择日期" style="width: 100%;" @change="vehicleCost"/>
        </el-form-item>
        <el-form-item label="车牌号" prop="vehicleNum">
          <el-input v-model="newVehicleForm.vehicleNum" ></el-input>
        </el-form-item>
        <el-form-item label="公里数 " prop="meter">
          <el-input v-model="newVehicleForm.meter" @change="vehicleCost" ></el-input>
        </el-form-item>
        <el-form-item label="金额(万元)" prop="totalPrice">
          <el-input v-model="newVehicleForm.totalPrice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="creater">
          <el-input v-model="newVehicleForm.creater" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属小组" prop="groupNum">
          <el-select v-model="newVehicleForm.groupNum" placeholder="请选择小组">
            <el-option label="1组" value="1组"></el-option>
            <el-option label="2组" value="2组"></el-option>
            <el-option label="3组" value="3组"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="newVehicleForm.notes"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateVehicleDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdateVehicle">确 定</el-button>
      </div>
    </el-dialog>
    <!--结束车辆申请弹窗-->
    <el-dialog
      title="结束车辆申请"
      :visible.sync="vehicleEndDialog"
      width="30%"
      :modal="false">
      <span>你是否确认结束</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="vehicleEndDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmVehicleEnd()">确 定</el-button>
        </span>
    </el-dialog>
    <!--新增设备弹窗-->
    <el-dialog title="申请设备" :visible.sync="newEquipmentDialog" :modal="false">
      <el-form :model="newPersonForm" ref="newPersonForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="报审序号" prop="reportNum">
          <el-input v-model="newEquipmentForm.reportNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="newEquipmentForm.contractName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="equipName">
          <el-button type="text" @click="getEquipment">选择设备</el-button>
          <div>{{newEquipmentForm.equipName}}</div>
        </el-form-item>
        <el-form-item label="出厂编码" prop="factoryNum">
          <el-input v-model="newEquipmentForm.factoryNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="equipType">
          <el-input v-model="newEquipmentForm.equipType" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="beginDateString" label="申请日期">
          <el-date-picker v-model="newEquipmentForm.beginDateString" @change="getEquipTips" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item prop="endDateString" label="预计结束日期">
          <el-date-picker v-model="newEquipmentForm.endDateString" @change="getEquipTips" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="设备原值（元）" prop="originalPrice">
          <el-input v-model="newEquipmentForm.originalPrice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="天折旧（元）" prop="dayDepreciation">
          <el-input v-model="newEquipmentForm.dayDepreciation" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="费用（万元）" prop="totalPrice">
          <el-input v-model="newEquipmentForm.totalPrice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="creater">
          <el-input v-model="newEquipmentForm.creater" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="newEquipmentForm.notes"></el-input>
        </el-form-item>
        <el-form-item label="所属小组" prop="groupNum">
          <el-select v-model="newEquipmentForm.groupNum" placeholder="请选择小组">
            <el-option label="1组" value="1"></el-option>
            <el-option label="2组" value="2"></el-option>
            <el-option label="3组" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newEquipmentDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmNewEquipment">确 定</el-button>
      </div>
    </el-dialog>
    <!--选择具体设备弹窗-->
    <el-dialog
      title="选择设备"
      :visible.sync="chooseEquipmentDialog"
      width="80%">
      <el-row>
        <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-ruleForm">
          <el-col :span="6" :offset="6" style="margin-top: 10px">
            <el-form-item label="设备名称：" prop="staffName">
              <el-input v-model="searchEquipmentForm.equipmentName"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button style="margin-left: -70px;margin-top: 10px" @click="searchEquipment">查找</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="equipments"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange2">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="factoryNum"
          label="出厂编号">
        </el-table-column>
        <el-table-column
          prop="equipName"
          label="设备名称"
        >
        </el-table-column>
        <el-table-column
          prop="equipType"
          label="附加资产描述"
        >
        </el-table-column>
        <el-table-column
          prop="originalPrice"
          label="设备原值（元）"
        >
        </el-table-column>
        <el-table-column
          prop="monthDepreciation"
          label="月折旧（元）"
        >
        </el-table-column>
        <el-table-column
          prop="dayDepreciation"
          label="天折旧（元）"
        >
        </el-table-column>
        <el-table-column
          prop="notes"
          label="备注"
        >
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
          <el-button @click="chooseEquipmentDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmChooseEquipments()">确 定</el-button>
        </span>
    </el-dialog>
    <!--设备删除弹出窗口-->
    <el-dialog
      title="设备申请"
      :visible.sync="dialogEquipment"
      width="30%"
      :modal="false">
      <span>你是否确认删除</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogEquipment = false">取 消</el-button>
          <el-button type="primary" @click="confirmDeleteEquipment()">确 定</el-button>
        </span>
    </el-dialog>
    <!--设备更新弹出窗口-->
    <el-dialog title="修改设备申请" :visible.sync="updateEquipmentDialog" :modal="false">
      <el-form :model="newPersonForm" ref="newPersonForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="报审序号" prop="reportNum">
          <el-input v-model="newEquipmentForm.reportNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="newEquipmentForm.contractName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="equipName">
          <el-button type="text" @click="getEquipment">选择设备</el-button>
          <div>{{newEquipmentForm.equipName}}</div>
        </el-form-item>
        <el-form-item label="出厂编码" prop="factoryNum">
          <el-input v-model="newEquipmentForm.factoryNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="equipType">
          <el-input v-model="newEquipmentForm.equipType" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="beginDateString" label="申请日期">
          <el-date-picker v-model="newEquipmentForm.beginDateString" @change="getEquipTips2" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item prop="endDateString" label="预计结束日期">
          <el-date-picker v-model="newEquipmentForm.endDateString" @change="getEquipTips2" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="设备原值（元）" prop="originalPrice">
          <el-input v-model="newEquipmentForm.originalPrice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="天折旧（元）" prop="dayDepreciation">
          <el-input v-model="newEquipmentForm.dayDepreciation" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="费用（万元）" prop="totalPrice">
          <el-input v-model="newEquipmentForm.totalPrice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="creater">
          <el-input v-model="newEquipmentForm.creater" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="newEquipmentForm.notes"></el-input>
        </el-form-item>
        <el-form-item label="所属小组" prop="groupNum">
          <el-select v-model="newEquipmentForm.groupNum" placeholder="请选择小组">
            <el-option label="1组" value="1"></el-option>
            <el-option label="2组" value="2"></el-option>
            <el-option label="3组" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateEquipmentDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEquipmentUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!--设备结束弹出窗口-->
    <el-dialog
      title="结束设备申请"
      :visible.sync="equipmentEndDialog"
      width="30%"
      :modal="false">
      <span>你是否确认结束</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="equipmentEndDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmEquipmentEnd()">确 定</el-button>
        </span>
    </el-dialog>
    <!--新增材料弹窗-->
    <el-dialog title="申请材料" :visible.sync="newMaterialDialog" :modal="false">
      <el-form :model="newMaterialForm" ref="newPersonForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="报审序号" prop="reportNum">
          <el-input v-model="newMaterialForm.reportNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="newMaterialForm.contractName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="材料名称" prop="materialName">
          <el-button type="text" @click="getMaterial">选择材料</el-button>
          <div>{{newMaterialForm.materialName}}</div>
        </el-form-item>
        <el-form-item label="材料类型" prop="materialType">
          <el-input v-model="newMaterialForm.materialType" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="newMaterialForm.brand" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="unit">
          <el-input v-model="newMaterialForm.unit" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单价（元）" prop="unitPrice">
          <el-input v-model="newMaterialForm.unitPrice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="newMaterialForm.count" @change="countChange"></el-input>
        </el-form-item>
        <el-form-item label="金额（万元）" prop="totalPrice">
          <el-input v-model="newMaterialForm.totalPrice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="creater">
          <el-input v-model="newMaterialForm.creater" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="applyTimeString" label="申请日期">
          <el-date-picker v-model="newMaterialForm.applyTimeString" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="newMaterialForm.notes"></el-input>
        </el-form-item>
        <el-form-item label="所属小组" prop="groupNum">
          <el-select v-model="newMaterialForm.groupNum" placeholder="请选择小组">
            <el-option label="1组" value="1"></el-option>
            <el-option label="2组" value="2"></el-option>
            <el-option label="3组" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newMaterialDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmNewMaterial">确 定</el-button>
      </div>
    </el-dialog>
    <!--选择材料弹窗-->
    <el-dialog
      title="选择材料"
      :visible.sync="chooseMaterialDialog"
      width="80%">
      <el-row>
        <el-form ref="searchMaterialForm" :model="searchMaterialForm" label-width="100px" class="demo-ruleForm">
          <el-col :span="6" :offset="6" style="margin-top: 10px">
            <el-form-item label="设备名称：" prop="staffName">
              <el-input v-model="searchMaterialForm.materialName"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button style="margin-left: -70px;margin-top: 10px" @click="searchMaterial">查找</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="materials"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange3">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="materialName"
          label="材料名称">
        </el-table-column>
        <el-table-column
          prop="materialType"
          label="型号规格"
        >
        </el-table-column>
        <el-table-column
          prop="brand"
          label="品牌"
        >
        </el-table-column>
        <el-table-column
          prop="unit"
          label="计量单位"
        >
        </el-table-column>
        <el-table-column
          prop="count"
          label="数量"
        >
        </el-table-column>
        <el-table-column
          prop="unitPrice"
          label="单价（元）"
        >
        </el-table-column>
        <el-table-column
          prop="totalPrice"
          label="总价（元）"
        >
        </el-table-column>
        <el-table-column
          prop="notes"
          label="备注"
        >
        </el-table-column>
        <el-table-column
          prop="materialID"
          label="编号"
        >
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
          <el-button @click="chooseMaterialDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmChooseMaterial()">确 定</el-button>
        </span>
    </el-dialog>
    <!--更新材料弹窗-->
    <el-dialog title="修改材料" :visible.sync="updateMaterialDialog" :modal="false">
      <el-form :model="newMaterialForm" ref="newPersonForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="报审序号" prop="reportNum">
          <el-input v-model="newMaterialForm.reportNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="newMaterialForm.contractName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="材料名称" prop="materialName">
          <el-button type="text" @click="getMaterial">选择材料</el-button>
          <div>{{newMaterialForm.materialName}}</div>
        </el-form-item>
        <el-form-item label="材料类型" prop="materialType">
          <el-input v-model="newMaterialForm.materialType" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="newMaterialForm.brand" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="unit">
          <el-input v-model="newMaterialForm.unit" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单价（元）" prop="unitPrice">
          <el-input v-model="newMaterialForm.unitPrice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="newMaterialForm.count" @change="countChange"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="creater">
          <el-input v-model="newMaterialForm.creater" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="applyTimeString" label="申请日期">
          <el-date-picker v-model="newMaterialForm.applyTimeString" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="newMaterialForm.notes"></el-input>
        </el-form-item>
        <el-form-item label="所属小组" prop="groupNum">
          <el-select v-model="newMaterialForm.groupNum" placeholder="请选择小组">
            <el-option label="1组" value="1"></el-option>
            <el-option label="2组" value="2"></el-option>
            <el-option label="3组" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateMaterialDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdateMaterial">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除材料弹窗-->
    <el-dialog
      title="材料申请"
      :visible.sync="deleteMaterialDialog"
      width="30%"
      :modal="false">
      <span>你是否确认删除</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="deleteMaterialDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmMaterialDelete()">确 定</el-button>
        </span>
    </el-dialog>
    <!--新增其他数据弹窗-->
    <el-dialog title="新增其他费用申请" :visible.sync="newOtherDialog" :modal="false">
      <el-form :model="newOtherForm" ref="newOtherForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="报审序号" prop="reportNum">
          <el-input v-model="newOtherForm.reportNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="newOtherForm.contractName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="feeName" label="费用描述">
          <el-input v-model="newOtherForm.feeName"/>
        </el-form-item>
        <el-form-item label="金额（万元）" prop="price">
          <el-input v-model="newOtherForm.price" ></el-input>
        </el-form-item>
        <el-form-item prop="applyDateString" label="申请日期">
          <el-date-picker v-model="newOtherForm.applyDateString" value-format="yyyy-MM-dd" placeholder="请选择日期"/>
        </el-form-item>
        <el-form-item label="申请人" prop="creater">
          <el-input v-model="newOtherForm.creater" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属小组" prop="groupNum">
          <el-select v-model="newOtherForm.groupNum" placeholder="请选择小组">
            <el-option label="1组" value="1"></el-option>
            <el-option label="2组" value="2"></el-option>
            <el-option label="3组" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="newOtherForm.notes"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newOtherDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmNewOther">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除其他数据弹窗-->
    <el-dialog
      title="其他费用申请"
      :visible.sync="deleteOtherDialog"
      width="30%"
      :modal="false">
      <span>你是否确认删除</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="deleteOtherDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmOtherDelete()">确 定</el-button>
        </span>
    </el-dialog>
    <!--修改其他数据弹窗-->
    <el-dialog title="修改其他费用申请" :visible.sync="updateOtherDialog" :modal="false">
      <el-form :model="newOtherForm" ref="newOtherForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="报审序号" prop="reportNum">
          <el-input v-model="newOtherForm.reportNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="newOtherForm.contractName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="feeName" label="费用描述">
          <el-input v-model="newOtherForm.feeName"/>
        </el-form-item>
        <el-form-item label="金额（万元）" prop="price">
          <el-input v-model="newOtherForm.price" ></el-input>
        </el-form-item>
        <el-form-item prop="applyDateString" label="申请日期">
          <el-date-picker v-model="newOtherForm.applyDateString" value-format="yyyy-MM-dd" placeholder="请选择日期"/>
        </el-form-item>
        <el-form-item label="申请人" prop="creater">
          <el-input v-model="newOtherForm.creater" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属小组" prop="groupNum">
          <el-select v-model="newOtherForm.groupNum" placeholder="请选择小组">
            <el-option label="1组" value="1"></el-option>
            <el-option label="2组" value="2"></el-option>
            <el-option label="3组" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="newOtherForm.notes"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateOtherDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdateOther">确 定</el-button>
      </div>
    </el-dialog>
    <!--新增外协合同弹窗-->
    <el-dialog
      title="新增"
      :visible.sync="newOutContractDialog"
      width="40%"
      :before-close="handleClose"
    >

      <el-form ref="newOutContractForm" :model="newOutContractForm" label-width="120px">
        <el-form-item label="外协合同名称">
          <el-input v-model="newOutContractForm.contractName"></el-input>
        </el-form-item>
        <el-form-item label="签署单位">
          <el-input v-model="newOutContractForm.signUnit"></el-input>
        </el-form-item>
        <el-form-item label="签署时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="合同开始时间"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            :clearable="false" v-model="newOutContractForm.signTimeString" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="金额(万元)">
          <el-input v-model="newOutContractForm.price"></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="newOutContractForm.creater" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="newOutContractForm.notes"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmNewoutContract">新增</el-button>
          <el-button @click="newOutContractDialog=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改外协合同-->
    <el-dialog
      title="修改"
      :visible.sync="updateOutContract"
      width="40%"
    >
      <el-form ref="updateOutContractForm" :model="updateOutContractForm" label-width="120px">
        <el-form-item label="外协合同名称">
          <el-input v-model="updateOutContractForm.contractName"></el-input>
        </el-form-item>
        <el-form-item label="签署单位">
          <el-input v-model="updateOutContractForm.signUnit"></el-input>
        </el-form-item>
        <el-form-item label="金额(万元)">
          <el-input v-model="updateOutContractForm.price"></el-input>
        </el-form-item>
        <el-form-item label="签署时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="合同开始时间"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            :clearable="false" v-model="updateOutContractForm.signTimeString" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="创建人">
          <el-input v-model="updateOutContractForm.creater" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="updateOutContractForm.notes"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editInfo">确认修改</el-button>
          <el-button @click="updateOutContract=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data() {
      return {
        dialogVisible1:false,
        form:{
          beginDateString:'',
          endDateString:'',
        },
        lrBox: null,
        cbBox: null,
        gccbBox:null,
        gclrBox:null,
        name:[],
        amount:[],//成本
        profit:[],//利润
        temp:{},
        oneData:[],
        oneName:[],
        value:'',
        options:[],
        reportNumData:[],
        analysisVisible:false,
        peoplePay:[],
        carPay:[],
        equipPay:[],
        materPay:[],
        assisPay:[],
        otherPay:[],
        newContractDialog:false,//新增合同弹窗
        newP:{ //新增合同表单
          reportNum:'',
          contractName:'',
          contractPerson:'',
          workLoad:'',
          contractAmount:'',
          manageCost:'',
          beginDateString:'',
          endDateString:'',
          notes:''
        },
        Visible:false,//分析合同金额
        //人员申请
        tableData:[], //主页表单数据
        contractName:'',
        department:'',
        reportNum:'',
        personData:[], //人员表单数据
        dialogVisible:false, //主页弹出窗口控制
        dialogPerson:false,//人员弹出窗口控制
        newPersonDialog:false,//新增人员弹出窗口
        businessPersonDialog:false,//出差人员弹出窗口控制
        updatePersonDialog:false,//更新数据弹出窗口
        dialogPersonEnd:false,//结束出差按钮
        searchForm:{ //搜索表单
          contractName:''
        },
        searchPersonForm:{ //查询出差人员列表
          staffName:''
        },
        multipleSelection:[],//选择人员的名单
        newPersonForm:{ //新增人员表单
          department:'',
          reportNum:'',
          contractName:'',
          staffName:[],
          staffID:'',
          pay:'',
          amount:'',
          creater:'',
          notes:'',
          groupNum:'',
          checkStatus:'',
          beginDateString:'',
          endDateString:'',
        },
        persons:[],//所有未出差人员
        travelId:'', //出差人员（用于后面删除等操作）
        activeName: 'first',
        tabChoose: '0',//tab选择
        projectId:'', //工程id（用于后面接口调用传参）
        //车辆申请
        vehicleData:[], //车辆申请表格数据
        newVehicleDialog:false, //新增车辆申请弹窗
        dialogVehicle:false,//删除车辆申请弹窗
        updateVehicleDialog:false,//更新车辆申请弹窗
        vehicleEndDialog:false,//结束车辆申请弹窗
        vehicleID:'',//车辆id(便于后面删除)
        newVehicleForm:{ //新增车辆表单数据
          department:'',
          reportNum:'',
          contractName:'',
          beginDateString:'',
          endDateString:'',
          vehicleNum:'',
          meter:'',
          totalPrice:'0',
          creater:'',
          groupNum:'',
          notes:'',
          projectID:'',
          vehicleId:''
        },
        equipmentData:[],//设备表格数据
        newEquipmentDialog:false, //新增设备弹窗控制
        newEquipmentForm:{  //新增设备表单
          equipName:'',
          factoryNum:'',
          equipType:'',
          beginDateString:'',
          endDateString:'',
          originalPrice:'',
          dayDepreciation:'',
          totalPrice:'',
          creater:'',
          notes:'',
          groupNum:'',
        },
        equipID:'',//设备ID
        chooseEquipmentDialog:false,//选择设备弹窗控制
        dialogEquipment:false,//设备删除弹出窗口控制
        updateEquipmentDialog:false,//设备更新弹出窗口控制
        equipmentEndDialog:false,//设备结束弹出窗口
        equipments:[] ,//所有具体设备
        multipleSelection2:[], //选择设备的名单
        searchEquipmentForm:{  //搜索设备框
          equipmentName:''
        },
        equipAppID:'',
        materialData:[], //材料数据
        newMaterialDialog:false, //新增材料弹窗控制
        updateMaterialDialog:false, //新增材料弹窗控制
        newMaterialForm:{ //新增材料表单
          contractName:'',
          department:'',
          applyTimeString:'',
          auditPerson:'',
          brand:'',
          count:'',
          creater:'',
          groupNum:'',
          materialID:'',
          materialName:'',
          materialType:'',
          notes:'',
          totalPrice:'',
          unit:'',
          unitPrice:'',
          startPrice:''
        },
        chooseMaterialDialog:false, //选择材料弹窗
        deleteMaterialDialog:false, //删除材料弹窗控制
        searchMaterialForm:{ //搜索具体材料
          materialName:''
        },
        materials:[], //所有具体材料
        multipleSelection3:[],//获取具体材料
        materialID:'',//材料ID
        otherData:[], //其他表格数据
        newOtherDialog:false, //新增其他数据弹窗
        deleteOtherDialog:false, //删除其他数据弹窗
        otherID:'', //其他数据的id
        updateOtherDialog:false,
        activeName1:'0',
        newOtherForm:{ //新增其他数据弹窗
          contractName:'',
          department:'',
          reportNum:'',
          feeName:'',
          price:'',
          applyDateString:'',
          creater:'',
          groupNum:'',
          notes:'',
        },
        outContractData:[], //外协合同表格数据
        newOutContractDialog:false, //新增外协合同弹窗
        newOutContractForm:{
          contractName:'',
          signUnit:'',
          signTimeString:'',
          price:'',
          creater:this.$cookie.get('uid'),
          notes:'',
          assistContractID:'',
          projectId:'',
        },
        txt:'',
        numberIndex:'',
        op:[],
        updateOutContract:false,//修改外协合同
        updateOutContractForm:{
          contractName:'',
          signUnit:'',
          signTimeString:'',
          price:'',
          creater:'',
          notes:'',
          assistContractID:'',
          projectId:'',
          reportNum:''
        },
        deleteId:''
      };
    },
    mounted() {
      this.getCon()
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.lrBox) {
        this.lrBox.resize()
      }
      if (this.cb) {
        this.cbBox.resize()
      }
    },
    methods:{
      //获取数据源
      getCon(){
        this.$http({
          url:this.$http.adornUrl('master/test/analysis'),
          method:'get'
        }).then(({data})=>{
          if (data&&data.status==200){
            this.tableData = data.data
            for (let i = 0; i <this.tableData.length ; i++) {
              this.tableData[i].number = i+1
            }
          }else {
            this.$message.error(data.message)
          }
        })
      },
      //整体分析
      analysisAll(){
        this.dialogVisible1 = true
        this.getEachartsData()
      },
      searchAll(){
        this.getEachartsData()
      },
      //初始化成本
      initcbBox(){
        var option = {
          title:{text:'成本统计(按工程)'},
          color: ['#3398DB'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : this.name,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'成本',
              type:'bar',
              barWidth: '60%',
              data:this.amount
            }
          ]
        };
        let bar = this.$refs.cb_Box
        this.cbBox = echarts.init(bar)
        this.cbBox.setOption(option)
        window.addEventListener('resize', () => {
          this.cbBox.resize()
        })
      },
      //初始化利润
      initlrBox(){
        var option = {
          title:{text:'利润统计(按工程)'},
          color: ['#3398DB'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : this.name,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'利润',
              type:'bar',
              barWidth: '60%',
              data:this.profit
            }
          ]
        };
        let bar = this.$refs.lr_Box
        this.lrBox = echarts.init(bar)
        this.lrBox.setOption(option)
        window.addEventListener('resize', () => {
          this.lrBox.resize()
        })
      },
      //初始化单个成本
      initgccbBox(){
        var option = {
          title : {
            text: this.temp.contractName+'成本分析',

            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: this.oneName
          },
          series : [
            {
              name: '成本',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:this.oneData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        let bar = this.$refs.gccb_Box
        this.gccbBox = echarts.init(bar)
        this.gccbBox.setOption(option)
        window.addEventListener('resize', () => {
          this.gccbBox.resize()
        })
      },
      //初始化单个利润
      initgclrBox(){
        var option = {
          title : {
            text: this.temp.contractName+'利润分析',
            x:'center'
          },
          color: ['#3398DB'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : [this.temp.contractName],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'利润',
              type:'bar',
              barWidth: '60%',
              data:[this.temp.profit]
            }
          ]
        };
        let bar = this.$refs.gclr_Box
        this.gclrBox = echarts.init(bar)
        this.gclrBox.setOption(option)
        window.addEventListener('resize', () => {
          this.gclrBox.resize()
        })
      },
      getEachartsData(){
        this.$http({
          url:this.$http.adornUrl('master/test/analysis/all'),
          method: 'post',
          data:{
            'beginDateString':this.form.beginDateString,
            'endDateString':this.form.endDateString,
          }
        }).then(({data})=>{
          if(data&&data.status==200){
            this.name = data.data.name
            this.amount = data.data.amount
            this.profit = data.data.profit
            this.$nextTick(function () {
              this.initcbBox()
              this.initlrBox()
            });
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //单个分析
      analysis(temp){
        this.Visible = true
        this.temp  = {...temp}
        this.getDap()
        this.getOneInfo(this.temp.reportNum)
      },
      // 获取科室
      getDap(){
        this.$http({
          url:this.$http.adornUrl('department'),
          method:'get'
        }).then(({data})=>{
          if(data&&data.status==200){
            this.options = data.data
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //从科室获取报审序号
      changeDap(val){
        this.$http({
          url:this.$http.adornUrl('reportNum'),
          method:'post',
          data:{
            'department':val
          }
        }).then(({data})=>{
          if(data&&data.status==200){
            this.reportNumData = data.data

          }else
          {
            this.$message.error(data.msg)
          }
        })
      },
      //获取单个数据源
      getOneInfo(val){
        this.$http({
          url:this.$http.adornUrl('master/test/analysis/one'),
          method:'post',
          data:{
            'reportNum':val
          }
        }).then(({data})=>{
          if(data&&data.status==200){
            this.temp = data.data.a
            this.oneData  = data.data.b
            this.initgccbBox()
            this.initgclrBox()
          }else {
            this.$message.error(data.msg)
          }
        })
      },
      handleClose(done){
        this.temp = []
        this.reportNumData = []
        this.options = []
        this.reportNum = ''
        this.value = ''
        done()
      },
      analysisInfo(val){
        this.analysisVisible = true
        this.projectId = val
        this.$http({
          url:this.$http.adornUrl('master/test/analysis/'+val+"/0"),
          method:'post'
        }).then(({data})=>{
          if (data && data.status == 200) {
            this.peoplePay = data.data
          }
        }).catch(error=>{
          this.$message.error(error)
        })
      },
      handleClick1(tab){
        if (tab.index==0){
          this.$http({
            url:this.$http.adornUrl('master/test/analysis/'+this.projectId+"/"+tab.index),
            method:'post'
          }).then(({data})=>{
            if (data && data.status == 200) {
              this.peoplePay = data.data
            }
          }).catch(error=>{
            this.$message.error(error)
          })
        }else if(tab.index==1){
          this.$http({
            url:this.$http.adornUrl('master/test/analysis/'+this.projectId+"/"+tab.index),
            method:'post'
          }).then(({data})=>{
            if (data && data.status == 200) {
              this.carPay = data.data
            }
          }).catch(error=>{
            this.$message.error(error)
          })
        }else if (tab.index==2){
          this.$http({
            url:this.$http.adornUrl('master/test/analysis/'+this.projectId+"/"+tab.index),
            method:'post'
          }).then(({data})=>{
            if (data && data.status == 200) {
              this.equipPay = data.data
            }
          }).catch(error=>{
            this.$message.error(error)
          })
        }else if (tab.index==3){
          this.$http({
            url:this.$http.adornUrl('master/test/analysis/'+this.projectId+"/"+tab.index),
            method:'post'
          }).then(({data})=>{
            if (data && data.status == 200) {
              this.materPay = data.data
            }
          }).catch(error=>{
            this.$message.error(error)
          })
        }else if (tab.index==4){
          this.$http({
            url:this.$http.adornUrl('master/test/analysis/'+this.projectId+"/"+tab.index),
            method:'post'
          }).then(({data})=>{
            if (data && data.status == 200) {
              this.assisPay = data.data
            }
          }).catch(error=>{
            this.$message.error(error)
          })
        }else {
          this.$http({
            url:this.$http.adornUrl('master/test/analysis/'+this.projectId+"/"+tab.index),
            method:'post'
          }).then(({data})=>{
            if (data && data.status == 200) {
              this.otherPay = data.data
            }
          }).catch(error=>{
            this.$message.error(error)
          })
        }
      },
      //搜索（当不传参数的时候无法判断）
      search(){
        this.$http({
          url:this.$http.adornUrl("master/test/project/search"),
          method:'post',
          data:this.$http.adornData({
            contractName : this.searchForm.contractName
          })
        }).then(res=>{
          if(res.data.status=='200'){
            this.tableData = res.data.data
            for(let i = 0;i<this.tableData.length;i++){
              this.tableData[i].number = i+1
            }
          }
        })
      },
      //新增合同
      newContract(){
        this.newContractDialog =true
      },
      //确认新增
      confirmNewContract(){
        this.$http({
          url:this.adornUrl.adornUrl('master/test/project'),
          method:'post',
          data:this.$http.adornData(this.newP)
        }).then(res=>{
          if(res.data.status=='201'){
            this.$message.success(res.data.message)
            this.getCon()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.newContractDialog = false
        })
      },
      // 删除合同
      deleteContract(id){
        this.$http({
          url:this.$http.adornUrl('master/test/project/'+id),
          method:'delete'
        }).then(res=>{
          if(res.data.status =='204'){
            this.getCon()
            this.$message.success(res.data.message)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
      //点击申请按钮
      operation(index, rows){
        this.dialogVisible = true
        this.projectId = rows[index].projectId
        this.contractName = rows[index].contractName
        this.department = rows[index].department
        this.reportNum = rows[index].reportNum
        this.personDataGet()
      },
      //人员申请数据获取
      personDataGet(){
        this.$http({
          url:this.$http.adornUrl('master/test/person/travel/'+this.projectId),
          method:'get'
        }).then(res=>{
          this.personData = res.data.data
          for(let i = 0 ;i<this.personData.length;i++){
            this.personData[i].number = i+1
            if(this.personData[i].checkStatus=='0'){
              this.personData[i].checkStatus = '待审核'
            }else if(this.personData[i].checkStatus=='1'){
              this.personData[i].checkStatus = '审核通过'
            }else if(this.personData[i].checkStatus=='2'){
              this.personData[i].checkStatus = '审核未通过'
            }
          }
        })
      },
      //用户点击删除按钮
      personDelete(index,rows){
        this.dialogPerson = true
        this.travelId = rows[index].travelId
      },
      //人员确认数据删除（有点bug）
      confirmPersonDelete(){
        this.$http({
          url:this.$http.adornUrl('master/test/person/'+this.travelId),
          method:'delete',
        }).then(res=>{
          if(res.data.status=='204'){
            this. personDataGet()
            this.$message.success(res.data.message)
          }else{
            this.$message.warning(res.data.msg)
          }
          this.dialogPerson = false
        })
      },
      //查询出差人员
      searchPerson(){
        this.$http({
          url:this.$http.adornUrl('master/test/person/search'),
          method:'post',
          data:this.$http.adornData({
            name:this.searchPersonForm.staffName
          })
        }).then(res=>{
          this.persons = res.data.data
        })
      },
      //用户点击更新按钮
      personUpdate(index,rows){
        this.updatePersonDialog = true
        this.newPersonForm.department = this.department
        this.newPersonForm.reportNum = this.reportNum
        this.newPersonForm.contractName = this.contractName
        this.newPersonForm.staffName = rows[index].staffName
        this.newPersonForm.staffID = rows[index].staffID
        this.newPersonForm.pay = rows[index].pay
        this.newPersonForm.travelId = rows[index].travelId
        this.newPersonForm.amount = rows[index].amount
        this.newPersonForm.creater = rows[index].creater
        this.newPersonForm.notes = rows[index].notes
        this.newPersonForm.groupNum = rows[index].groupNum
        this.newPersonForm.checkStatus = rows[index].checkStatus
        this.newPersonForm.beginDateString = rows[index].beginDateString
        this.newPersonForm.endDateString = rows[index].endDateString
      },
      //确认修改（500）
      confirmPersonUpdate(){
        this.businessPersonDialog = false
        this.newPersonForm.staffName = this.multipleSelection
        let id = []
        id[0] = this.newPersonForm.staffName[0].staffID
        this.$http({
          url:this.$http.adornUrl('master/test/person'),
          method:'put',
          data:this.$http.adornData({
            notes:this.newPersonForm.notes,
            projectId:this.projectId,
            travelId:this.newPersonForm.travelId,
            groupNum:this.newPersonForm.groupNum,
            beginDateString:this.newPersonForm.beginDateString,
            endDateString:this.newPersonForm.endDateString,
            creater:this.newPersonForm.creater,
            staffID:id[0],
          })
        }).then(res=>{
          if(res.data.status == '204'){
            this.personDataGet()
            this.$message.success(res.data.message)
          }
          else{
            this.$message.warning(res.data.msg)
          }
          this.updatePersonDialog = false
        })
      },
      //点击结束出差按钮
      personEnd(index,rows){
        this.dialogPersonEnd = true
        this.travelId = rows[index].travelId
      },
      //确认结束出差
      confirmPersonEnd(){
        this.$http({
          url:this.$http.adornUrl('master/test/person/'+this.travelId),
          method:'put'
        }).then(res=>{
          if (res.data.status=='204'){
            this.$message.success(res.data.message)
          }else{
            this.$message.warning(res.data.msg)
          }
          this.dialogPersonEnd = false
        })
      },
      //获取所有未出差的人员
      getPerson(){
        this.businessPersonDialog = true
        this.$http({
          url:this.$http.adornUrl("master/test/person"),
          method:'get'
        }).then(res=>{
          this.persons = res.data.data
        })
      },
      //点击新增出差人员按钮
      newPerson(){
        this.newPersonDialog = true
        this.newPersonForm.department = this.department
        this.newPersonForm.reportNum = this.reportNum
        this.newPersonForm.contractName = this.contractName
        this.newPersonForm.staffName = []
        this.persons = []
        this.newPersonForm.pay = ''
        this.newPersonForm.amount = ''
        this.newPersonForm.notes = ''
        this.newPersonForm.groupNum = ''
        this.newPersonForm.beginDateString = ''
        this.newPersonForm.endDateString = ''
        this.newPersonForm.creater = this.$cookie.get('uid')
      },
      //用户点击确认新增(400)
      confirmNewPerson(){
        let staffID = []
        for (let i = 0; i < this.newPersonForm.staffName.length;i++) {
          staffID[i] = this.newPersonForm.staffName[i].staffID
        }
        this.$http({
          url:this.$http.adornUrl('master/test/person'),
          method:'post',
          data:this.$http.adornData({
            notes:this.newPersonForm.notes,
            projectId:this.projectId,
            groupNum:this.newPersonForm.groupNum,
            beginDateString:this.newPersonForm.beginDateString,
            endDateString:this.newPersonForm.endDateString,
            creater:this.newPersonForm.creater,
            staffID:staffID,
          })
        }).then(res=>{
          if(res.data.status == '201'){
            this.$message.success(res.data.message)
            this.personDataGet()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.newPersonDialog = false
        })
      },
      //选择未出差的人
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      //确认选择未出差的人
      confirmChoosePerson(){
        this.businessPersonDialog = false
        this.newPersonForm.staffName = this.multipleSelection
        if(this.newPersonForm.beginDateString&&this.newPersonForm.endDateString){
          let id = []
          id[0] = this.newPersonForm.staffName[0].staffID
          this.$http({
            url:this.$http.adornUrl('master/test/person/salary'),
            method:'post',
            data:this.$http.adornData({
              beginDateString:this.newPersonForm.beginDateString,
              endDateString:this.newPersonForm.endDateString,
              id:id
            })
          }).then(res=>{
            this.newPersonForm.staffName = this.newPersonForm.staffName[0].staffName
            this.newPersonForm.pay = res.data.data[0]
            this.newPersonForm.amount = res.data.data[1]
          })
        }
      },
      //取消选择未出差的人
      cancelChoosePerson(){
        this.businessPersonDialog = false
        this.newPersonForm.staffName = ''
      },
      //车辆数据获取
      vehicleDataGet(){
        this.$http({
          url:this.$http.adornUrl('master/test/cars/'+this.projectId),
          method:'get'
        }).then(res=>{
          if(res.data.status == '200'){
            this.vehicleData = res.data.data
            for(let i =0;i<this.vehicleData.length;i++){
              this.vehicleData[i].number = i +1
              if(this.vehicleData[i].completeStatus == 0){
                this.vehicleData[i].completeStatus = '未完成'
              }else if(this.vehicleData[i].completeStatus== 1){
                this.vehicleData[i].completeStatus = '已完成'
              }
            }
          }
        })
      },
      //点击新增车辆申请按钮
      newVehicle(){
        this.newVehicleDialog = true
        this.newVehicleForm.contractName = this.contractName
        this.newVehicleForm.department = this.department
        this.newVehicleForm.reportNum = this.reportNum
        this.newVehicleForm.creater = this.$cookie.get('uid')
        this.newVehicleForm.beginDateString = ''
        this.newVehicleForm.endDateString = ''
        this.newVehicleForm.vehicleNum = ''
        this.newVehicleForm.meter = ''
        this.newVehicleForm.totalPrice = '0'
        this.newVehicleForm.groupNum = ''
        this.newVehicleForm.notes = ''
      },
      //确认新增车辆申请(400)
      confirmNewVehicle(){
        this.$http({
          url: this.$http.adornUrl('master/test/cars'),
          method: 'post',
          data: this.$http.adornData({
            department: this.newVehicleForm.department,
            reportNum: this.newVehicleForm.reportNum,
            contractName: this.newVehicleForm.contractName,
            beginDateString: this.newVehicleForm.beginDateString,
            endDateString: this.newVehicleForm.endDateString,
            vehicleNum: this.newVehicleForm.vehicleNum,
            meter: this.newVehicleForm.meter,
            totalPrice: this.newVehicleForm.totalPrice,
            creater: this.newVehicleForm.creater,
            projectID: this.projectId,
            groupNum: this.newVehicleForm.groupNum,
            notes: this.newVehicleForm.notes
          })
        }).then(res=>{
          if(res.data.status =='201'){
            this.$message.success(res.data.message)
            this.vehicleDataGet()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.newVehicleDialog =false
        })
      },
      //点击删除车辆申请按钮
      deleteVehicle(index,rows){
        this.dialogVehicle = true
        this.vehicleID = rows[index].vehicleID
      },
      //确认删除车辆申请
      confirmDeleteVehicle(){
        this.$http({
          url:this.$http.adornUrl('master/test/cars/'+this.vehicleID),
          method:'delete'
        }).then(res=>{
          if(res.data.status=='204'){
            this.$message.success('删除成功')
            this.vehicleDataGet()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.dialogVehicle = false
        })
      },
      //点击更新车辆申请按钮
      updateVehicle(index,rows){
        this.updateVehicleDialog = true
        this.newVehicleForm.contractName = this.contractName
        this.newVehicleForm.department = this.department
        this.newVehicleForm.reportNum = this.reportNum
        this.newVehicleForm.beginDateString = rows[index].beginDateString
        this.newVehicleForm.endDateString = rows[index].endDateString
        this.newVehicleForm.vehicleNum = rows[index].vehicleNum
        this.newVehicleForm.meter = rows[index].meter
        this.newVehicleForm.totalPrice = rows[index].totalPrice
        this.newVehicleForm.creater = rows[index].creater
        this.newVehicleForm.groupNum = rows[index].groupNum
        this.newVehicleForm.notes = rows[index].notes
        this.newVehicleForm.vehicleId = rows[index].vehicleID
      },
      //点击确认修改车辆申请（500）
      confirmUpdateVehicle(){
        this.$http({
          url:this.$http.adornUrl('master/test/cars'),
          method:'put',
          data:this.$http.adornData({
            department: this.newVehicleForm.department,
            reportNum: this.newVehicleForm.reportNum,
            contractName: this.newVehicleForm.contractName,
            beginDateString: this.newVehicleForm.beginDateString,
            endDateString: this.newVehicleForm.endDateString,
            vehicleNum: this.newVehicleForm.vehicleNum,
            meter: this.newVehicleForm.meter,
            totalPrice: this.newVehicleForm.totalPrice,
            creater: this.newVehicleForm.creater,
            projectID: this.projectId,
            groupNum: this.newVehicleForm.groupNum,
            notes: this.newVehicleForm.notes,
            vehicleID: this.newVehicleForm.vehicleId,
          })
        }).then(res=>{
          if(res.data.status == '204'){
            this.$message.success(res.data.message)
            this.vehicleDataGet()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.updateVehicleDialog = false
        })
      },
      //点击结束车辆申请按钮
      endVehicle(index,rows){
        this.vehicleEndDialog = true
        this.vehicleID = rows[index].vehicleID
      },
      //确认结束车辆申请
      confirmVehicleEnd(){
        this.$http({
          url:this.$http.adornUrl('master/test/cars/'+this.vehicleID),
          method:'put'
        }).then(res=>{
          if(res.data.status == '400'){
            this.$message.success(res.data.msg)
            this.vehicleDataGet()
          }else if(res.data.status == '204'){
            this.$message.warning(res.data.message)
            this.vehicleDataGet()
          }else{
            this.$message.error(res.data.msg)
            this.vehicleDataGet()
          }
          this.vehicleEndDialog = false
        })
      },
      //设备数据获取
      equipmentDataGet(){
        this.$http({
          url:this.$http.adornUrl('master/test/equip/'+this.projectId),
          method:'get'
        }).then(res=>{
          this.equipmentData = res.data.data
          for(let i =0;i<this.equipmentData.length;i++){
            if(this.equipmentData[i].checkStatus=='0'){
              this.equipmentData[i].checkStatus ='未审核'
            }else if(this.equipmentData[i].checkStatus =='1'){
              this.equipmentData[i].checkStatus = '审核通过'
            }else  if(this.equipmentData[i].checkStatus =='2'){
              this.equipmentData[i].checkStatus = '审核未通过'
            }
            this.equipmentData[i].number = i+1
          }
        })
      },
      //点击新增设备按钮
      newEquipment(){
        this.newEquipmentDialog = true
        this.newEquipmentForm.equipName = ''
        this.newEquipmentForm.equipType = ''
        this.newEquipmentForm.factoryNum = ''
        this.newEquipmentForm.originalPrice = ''
        this.newEquipmentForm.dayDepreciation = ''
        this.newEquipmentForm.totalPrice = ''
        this.newEquipmentForm.notes = ''
        this.newEquipmentForm.groupNum = ''
        this.newEquipmentForm.beginDateString = ''
        this.newEquipmentForm.endDateString = ''
        this.newEquipmentForm.contractName = this.contractName
        this.newEquipmentForm.department = this.department
        this.newEquipmentForm.reportNum = this.reportNum
        this.newEquipmentForm.creater = this.$cookie.get('uid')
      },
      //点击选择设备按钮
      getEquipment(){
        this.newEquipmentForm.equipName = ''
        this.newEquipmentForm.factoryNum = ''
        this.newEquipmentForm.equipType = ''
        this.newEquipmentForm.originalPrice = ''
        this.newEquipmentForm.dayDepreciation = ''
        this.chooseEquipmentDialog = true
        this.$http({
          url:this.$http.adornUrl('master/test/equip'),
          method:'get'
        }).then(res=>{
          this.equipments = res.data.data
        })
      },
      //获取具体设备
      handleSelectionChange2(val){
        this.multipleSelection2 = val
      },
      //搜索具体设备
      searchEquipment(){
        this.$http({
          url:this.$http.adornUrl('master/test/equip/search'),
          method:'post',
          data:this.$http.adornData({
            name:this.searchEquipmentForm.equipmentName
          })
        }).then(res=>{
          this.equipments = res.data.data
        })
      },
      //确认选择具体设备
      confirmChooseEquipments(){
        this.newEquipmentForm.equipName = ''
        this.newEquipmentForm.factoryNum = ''
        this.newEquipmentForm.equipType = ''
        this.newEquipmentForm.originalPrice = ''
        this.newEquipmentForm.dayDepreciation = ''
        for (let i=0;i<this.multipleSelection2.length;i++){
          this.newEquipmentForm.equipName += this.multipleSelection2[i].equipName +'|'
          this.newEquipmentForm.factoryNum += this.multipleSelection2[i].factoryNum +'|'
          this.newEquipmentForm.equipType += this.multipleSelection2[i].equipType +'|'
          this.newEquipmentForm.originalPrice += this.multipleSelection2[i].originalPrice +'|'
          this.newEquipmentForm.dayDepreciation += this.multipleSelection2[i].dayDepreciation +'|'
        }
        this.newEquipmentForm.equipName=this.newEquipmentForm.equipName.substring(0,this.newEquipmentForm.equipName.length-1)
        this.newEquipmentForm.factoryNum=this.newEquipmentForm.factoryNum.substring(0,this.newEquipmentForm.factoryNum.length-1)
        this.newEquipmentForm.equipType=this.newEquipmentForm.equipType.substring(0,this.newEquipmentForm.equipType.length-1)
        this.newEquipmentForm.originalPrice=this.newEquipmentForm.originalPrice.substring(0,this.newEquipmentForm.originalPrice.length-1)
        this.newEquipmentForm.dayDepreciation=this.newEquipmentForm.dayDepreciation.substring(0,this.newEquipmentForm.dayDepreciation.length-1)
        this.getEquipTips()
        this.chooseEquipmentDialog =false
      },
      //确认新增设备
      confirmNewEquipment(){
        this.projectId = this.projectId.toString()
        this.$http({
          url:this.$http.adornUrl('master/test/equip'),
          method:'post',
          data:this.$http.adornData({
            equip:this.multipleSelection2,
            contractName:this.newEquipmentForm.contractName,
            projectID:this.projectId,
            reportNum:this.newEquipmentForm.reportNum,
            creater:this.newEquipmentForm.creater,
            beginDateString:this.newEquipmentForm.beginDateString,
            endDateString:this.newEquipmentForm.endDateString,
            notes:this.newEquipmentForm.notes,
            groupNum:this.newEquipmentForm.groupNum
          })
        }).then(res=>{
          if(res.data.status =='201'){
            this.$message.success(res.data.message)
            this.equipmentDataGet()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.newEquipmentDialog = false
        })
      },
      //点击删除设备按钮
      equipmentDelete(index,rows){
        this.dialogEquipment = true
        this.equipAppID = rows[index].equipAppID
      },
      //确认删除设备（500）
      confirmDeleteEquipment(){
        this.$http({
          url:this.$http.adornUrl('master/test/equip/'+this.equipAppID),
          method:'delete'
        }).then(res=>{
          if(res.data.status == '204'){
            this.$message.success(res.data.message)
            this.equipmentDataGet()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.dialogEquipment = false
        })
      },
      //点击更新设备按钮
      equipmentUpdate(index,rows){
        this.updateEquipmentDialog = true
        this.newEquipmentForm.contractName = this.contractName
        this.newEquipmentForm.department = this.department
        this.newEquipmentForm.reportNum = this.reportNum
        this.newEquipmentForm.creater = rows[index].creater
        this.newEquipmentForm.equipType = rows[index].equipType
        this.newEquipmentForm.factoryNum = rows[index].factoryNum
        this.newEquipmentForm.notes = rows[index].notes
        this.newEquipmentForm.beginDateString = rows[index].beginDateString
        this.newEquipmentForm.endDateString = rows[index].endDateString
        this.newEquipmentForm.originalPrice = rows[index].originalPrice
        this.newEquipmentForm.totalPrice = rows[index].totalPrice
        this.newEquipmentForm.dayDepreciation = rows[index].dayDepreciation
        this.newEquipmentForm.equipName = rows[index].equipName
        this.newEquipmentForm.groupNum = rows[index].groupNum
        this.newEquipmentForm.equipAppID = rows[index].equipAppID
      },
      //确认更新设备修改(500)
      confirmEquipmentUpdate(){
        this.$http({
          url:this.$http.adornUrl('master/test/equip'),
          method:'put',
          data:this.$http.adornData({
            projectID:this.projectId,
            equipAppID:this.newEquipmentForm.equipAppID,
            equipID:this.multipleSelection2[0].equipID,
            equipName:this.multipleSelection2[0].equipName,
            equipType:this.multipleSelection2[0].equipType,
            originalPrice:this.multipleSelection2[0].originalPrice,
            dayDepreciation:this.multipleSelection2[0].dayDepreciation,
            creater:this.newEquipmentForm.creater,
            beginDateString:this.newEquipmentForm.beginDateString,
            endDateString:this.newEquipmentForm.endDateString,
            totalPrice:this.newEquipmentForm.totalPrice,
            notes:this.newEquipmentForm.notes,
            groupNum:this.newEquipmentForm.groupNum
          })
        }).then(res=>{
          if(res.data.status == '204'){
            this.$message.success(res.data.message)
            this.equipmentDataGet()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.updateEquipmentDialog = false
        })
      },
      //点击结束设备按钮
      equipmentEnd(index,rows){
        this.equipmentEndDialog = true
        this.equipAppID = rows[index].equipAppID
      },
      //确认结束设备(500)
      confirmEquipmentEnd(){
        this.$http({
          url:this.$http.adornUrl('master/test/equip/end'),
          method:'post',
          data:this.$http.adornData({
            equipAppID:this.equipAppID
          })
        }).then(res=>{
          if(res.data.status =='201'){
            this.$message.success(res.data.message)
          }else{
            this.$message.warning(res.data.msg)
          }
          this.equipmentEndDialog = false
        })
      },
      //材料数据获取
      materialDataGet(){
        this.$http({
          url:this.$http.adornUrl('master/test/material/'+this.projectId),
          method:'get'
        }).then(res=>{
          this.materialData = res.data.data
          for (let i =0 ; i<this.materialData.length;i++){
            if(this.materialData[i].checkStatus=='0'){
              this.materialData[i].checkStatus ='未审核'
            }else if(this.materialData[i].checkStatus =='1'){
              this.materialData[i].checkStatus = '审核通过'
            }else  if(this.materialData[i].checkStatus =='2'){
              this.materialData[i].checkStatus = '审核未通过'
            }
            this.materialData[i].number = i+1
          }
        })
      },
      //点击新增材料按钮
      newMaterial(){
        this.newMaterialDialog = true
        this.newMaterialForm.contractName = this.contractName
        this.newMaterialForm.department = this.department
        this.newMaterialForm.reportNum = this.reportNum
        this.newMaterialForm.creater = this.$cookie.get('uid')
        this.newMaterialForm.materialName = ''
        this.newMaterialForm.materialType = ''
        this.newMaterialForm.brand = ''
        this.newMaterialForm.unitPrice = ''
        this.newMaterialForm.totalPrice = ''
        this.newMaterialForm.applyTimeString = ''
        this.newMaterialForm.notes = ''
        this.newMaterialForm.count = ''
        this.newMaterialForm.unit = ''
        this.newMaterialForm.groupNum = ''
      },
      //点击增加材料按钮
      getMaterial(){
        this.chooseMaterialDialog = true
        this.$http({
          url:this.$http.adornUrl('master/test/material'),
          method:'get'
        }).then(res=>{
          this.materials = res.data.data
        })
      },
      //搜索具体材料（貌似不对）
      searchMaterial(){
        this.$http({
          url:this.$http.adornUrl('master/test/material/search'),
          method:'post',
          data:this.$http.adornData({
            name:this.searchMaterialForm.materialName
          })
        }).then(res=>{
          this.materials = res.data.data
        })
      },
      //获取具体材料
      handleSelectionChange3(val){
        this.multipleSelection3 = val
      },
      //确认具体材料选择
      confirmChooseMaterial(){
        this.newMaterialForm.materialName=''
        this.newMaterialForm.materialType=''
        this.newMaterialForm.brand=''
        this.newMaterialForm.unit=''
        this.newMaterialForm.unitPrice=''
        this.newMaterialForm.totalPrice=''
        for(let i = 0 ;i<this.multipleSelection3.length;i++){
          this.newMaterialForm.materialName += this.multipleSelection3[i].materialName +'|'
          this.newMaterialForm.materialType += this.multipleSelection3[i].materialType +'|'
          this.newMaterialForm.brand += this.multipleSelection3[i].brand +'|'
          this.newMaterialForm.unit += this.multipleSelection3[i].unit +'|'
          this.newMaterialForm.unitPrice += this.multipleSelection3[i].unitPrice +'|'
          this.newMaterialForm.totalPrice += this.multipleSelection3[i].totalPrice +'|'
        }
        this.newMaterialForm.materialName=this.newMaterialForm.materialName.substring(0,this.newMaterialForm.materialName.length-1)
        this.newMaterialForm.materialType=this.newMaterialForm.materialType.substring(0,this.newMaterialForm.materialType.length-1)
        this.newMaterialForm.brand=this.newMaterialForm.brand.substring(0,this.newMaterialForm.brand.length-1)
        this.newMaterialForm.unit=this.newMaterialForm.unit.substring(0,this.newMaterialForm.unit.length-1)
        this.newMaterialForm.unitPrice=this.newMaterialForm.unitPrice.substring(0,this.newMaterialForm.unitPrice.length-1)
        this.newMaterialForm.totalPrice=this.newMaterialForm.totalPrice.substring(0,this.newMaterialForm.totalPrice.length-1)
        let totalPrice = this.newMaterialForm.totalPrice.split('|')
        let sum = 0
        for(let i =0 ;i<totalPrice.length ;i++){
          sum += parseInt(totalPrice[i])
        }
        this.newMaterialForm.totalPrice = sum.toString()
        this.newMaterialForm.startPrice = sum.toString()
        this.chooseMaterialDialog = false
      },
      //监听数量的变化
      countChange(){
        let sum = 0
        console.log(this.newMaterialForm.totalPrice)
        sum = parseInt(this.newMaterialForm.startPrice) * parseInt(this.newMaterialForm.count)
        sum /=10000
        this.newMaterialForm.totalPrice = sum.toString()
      },
      //确认新增材料
      confirmNewMaterial(){
        let material = this.multipleSelection3
        this.$http({
          url:this.$http.adornUrl('master/test/material'),
          method:"post",
          data:this.$http.adornData({
            projectID:this.projectId,
            department:this.newMaterialForm.department,
            applyTimeString:this.newMaterialForm.applyTimeString,
            auditPerson:this.newMaterialForm.auditPerson,
            count:this.newMaterialForm.count,
            creater:this.newMaterialForm.creater,
            groupNum:this.newMaterialForm.groupNum,
            notes:this.newMaterialForm.notes,
            material:material
          })
        }).then(res=>{
          if(res.data.status == '201'){
            this.$message.success(res.data.message)
            this.materialDataGet()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.newMaterialDialog = false
        })
      },
      //点击删除材料按钮
      materialDelete(index,rows){
        this.deleteMaterialDialog = true
        this.materialAppID = rows[index].materialAppID
      },
      //确认删除材料（500）
      confirmMaterialDelete(){
        this.$http({
          url:this.$http.adornUrl('master/test/material/'+this.materialAppID),
          method:'delete'
        }).then(res=>{
          if(res.data.status=='204'){
            this.materialDataGet()
            this.$message.success(res.data.message)
          }else{
            this.$message.warning(res.data.msg)
          }
          this.deleteMaterialDialog = false
        })
      },
      //点击材料更新
      materialUpdate(index,rows){
        this.updateMaterialDialog = true
        this.newMaterialForm.contractName = this.contractName
        this.newMaterialForm.department = this.department
        this.newMaterialForm.reportNum = this.reportNum
        this.newMaterialForm.creater = this.$cookie.get('uid')
        this.newMaterialForm.applyTimeString = rows[index].applyTimeString
        this.newMaterialForm.auditPerson = rows[index].auditPerson
        this.newMaterialForm.brand = rows[index].brand
        this.newMaterialForm.count = rows[index].count
        this.newMaterialForm.groupNum = rows[index].groupNum
        this.newMaterialForm.materialID = rows[index].materialID
        this.newMaterialForm.materialAppID = rows[index].materialAppID
        this.newMaterialForm.materialName = rows[index].materialName
        this.newMaterialForm.materialType = rows[index].materialType
        this.newMaterialForm.notes = rows[index].notes
        this.newMaterialForm.totalPrice = rows[index].totalPrice
        this.newMaterialForm.unit = rows[index].unit
        this.newMaterialForm.unitPrice = rows[index].unitPrice
      },
      //确认材料数据更新
      confirmUpdateMaterial(){
        this.$http({
          url:this.$http.adornUrl('master/test/material'),
          method:'put',
          data:this.$http.adornData({
            materialAppID:this.newMaterialForm.materialAppID,
            materialID:this.multipleSelection3[0].materialID,
            projectID:this.projectId,
            groupNum:this.newMaterialForm.groupNum,
            materialName:this.newMaterialForm.materialName,
            brand:this.newMaterialForm.brand,
            unit:this.newMaterialForm.unit,
            unitPrice:this.newMaterialForm.unitPrice,
            count:this.newMaterialForm.count,
            totalPrice:this.newMaterialForm.totalPrice,
            applyTimeString:this.newMaterialForm.applyTimeString,
            notes:this.newMaterialForm.notes,
            creater:this.newMaterialForm.creater,
            materialType:this.newMaterialForm.materialType,
          })
        }).then(res=>{
          if(res.data.status == '204'){
            this.$message.success(res.data.message)
            this.materialDataGet()
          }else {
            this.$message.warning(res.data.msg)
          }
          this.updateMaterialDialog = false
        })
      },
      //其他数据获取
      otherDataGet(){
        this.$http({
          url:this.$http.adornUrl('master/test/otherapply/'+this.projectId),
          method:'get'
        }).then(res=>{
          this.otherData = res.data.data
          for(let i =0 ; i<this.otherData.length;i++){
            this.otherData[i].number = i+1
          }
        })
      },
      //点击新增其他按钮
      newOther(){
        this.newOtherDialog = true
        this.newOtherForm.contractName = this.contractName
        this.newOtherForm.department = this.department
        this.newOtherForm.reportNum = this.reportNum
        this.newOtherForm.creater = this.$cookie.get('uid')
        this.newOtherForm.feeName = ''
        this.newOtherForm.price = ''
        this.newOtherForm.applyDateString = ''
        this.newOtherForm.groupNum = ''
        this.newOtherForm.notes = ''
      },
      //确认新增其他数据
      confirmNewOther(){
        this.$http({
          url:this.$http.adornUrl('master/test/otherapply'),
          method:"post",
          data:this.$http.adornData({
            projectID:this.projectId,
            feeName:this.newOtherForm.feeName,
            price:this.newOtherForm.price,
            applyDateString:this.newOtherForm.applyDateString,
            creater:this.newOtherForm.creater,
            groupNum:this.newOtherForm.groupNum,
            notes:this.newOtherForm.notes,
          })
        }).then(res=>{
          if(res.data.status == '201'){
            this.$message.success(res.data.message)
            this.otherDataGet()
          }
          else{
            this.$message.warning(res.data.msg)
          }
          this.newOtherDialog = false
        })
      },
      //点击删除其他数据
      deleteOther(index,rows){
        this.deleteOtherDialog = true
        this.otherID = rows[index].otherID
      },
      //确认删除其他数据
      confirmOtherDelete(){
        this.$http({
          url:this.$http.adornUrl('master/test/otherapply/'+this.otherID),
          method:'delete',
        }).then(res=>{
          if(res.data.status == '204'){
            this.$message.success(res.data.message)
            this.otherDataGet()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.deleteOtherDialog = false
        })
      },
      //点击修改其他数据
      updateOther(index,rows){
        this.updateOtherDialog = true
        this.newOtherForm.contractName = this.contractName
        this.newOtherForm.department = this.department
        this.newOtherForm.reportNum = this.reportNum
        this.newOtherForm.creater = this.$cookie.get('uid')
        this.newOtherForm.feeName = rows[index].feeName
        this.newOtherForm.price = rows[index].price
        this.newOtherForm.applyDateString = rows[index].applyDateString
        this.newOtherForm.groupNum = rows[index].groupNum
        this.newOtherForm.notes = rows[index].notes
        this.otherID = rows[index].otherID
      },
      //确认修改其他数据
      confirmUpdateOther(){
        this.$http({
          url:this.$http.adornUrl('master/test/otherapply'),
          method:"put",
          data:this.$http.adornData({
            feeName:this.newOtherForm.feeName,
            price:this.newOtherForm.price,
            applyDateString:this.newOtherForm.applyDateString,
            creater:this.newOtherForm.creater,
            groupNum:this.newOtherForm.groupNum,
            notes:this.newOtherForm.notes,
            otherID:this.otherID,
            projectID:this.projectId
          })
        }).then(res=>{
          if(res.data.status == '204'){
            this.$message.success(res.data.message)
            this.otherDataGet()
          }
          else{
            this.$message.warning(res.data.msg)
          }
          this.updateOtherDialog = false
        })
      },
      //获取外协合同
      contractDataGet(){
        this.$http({
          url:this.$http.adornUrl('master/test/assist'),
          method:'get'
        }).then(res=>{
          this.outContractData = res.data.data
          for(let i = 0 ; i<this.outContractData.length;i++){
            this.outContractData[i].number = i+1
          }
        })
      },
      //新增外协合同
      newOutContract(){
        this.newOutContractDialog = true
      },
      //确认新增外协合同
      confirmNewoutContract(){
        this.$http({
          url:this.$http.adornUrl('master/test/assist'),
          method:'post',
          data:this.$http.adornData({
            projectId:this.projectId,
            contractName:this.newOutContractForm.contractName,
            signUnit:this.newOutContractForm.signUnit,
            signTimeString:this.newOutContractForm.signTimeString,
            price:this.newOutContractForm.price,
            creater:this.$cookie.get('uid'),
            notes:this.newOutContractForm.notes,
            assistContractID:this.newOutContractForm.assistContractID
          })
        }).then(res=>{
          if(res.data.status=='201'){
            this.$message.success(res.data.message)
            this.contractDataGet()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.newOutContractDialog = false
        })
      },
      //修改外协合同
      edit(info){
        this.updateOutContract = true
        this.updateOutContractForm = {...info}
      },
      editInfo(){
        this.$http({
          url:this.$http.adornUrl('master/test/assist'),
          method: 'put',
          data:{
            'assistContractID':this.updateOutContractForm.assistContractID,
            'projectId':this.updateOutContractForm.projectId,
            'contractName':this.updateOutContractForm.contractName,
            'signUnit':this.updateOutContractForm.signUnit,
            'price':this.updateOutContractForm.price,
            'creater':this.$cookie.get('uid'),
            'notes':this.updateOutContractForm.notes,
            'signTimeString':this.updateOutContractForm.signTimeString,

          }
        }).then(({data})=>{
          if (data&&data.status==204){
            this.contractDataGet()
            this.$message.success(data.message)
            this.updateOutContract =false
          }else {
            this.$message.warning(data.msg)
            this.updateOutContract =false
          }
        })
      },
      //删除外协合同
      deleteInfo(id){
        this.$http({
          url: this.$http.adornUrl('master/test/assist/'+id),
          method: 'delete'
        }).then(({data})=>{
          if (data&&data.status==204){
            this.$message.success(data.message)
            this.contractDataGet()
          }else {
            this.$message.error(data.msg)
          }
        })
      },
      //选择tab
      handleClick(tab) {
        this.tabChoose = tab.index
        if(this.tabChoose == 0){
          this.personDataGet()
        }else if(this.tabChoose == 1){
          this.vehicleDataGet()
        }else if(this.tabChoose == 2){
          this.equipmentDataGet()
        }else if(this.tabChoose ==3){
          this.materialDataGet()
        }else if(this.tabChoose == 4){
          this.otherDataGet()
        }else if(this.tabChoose){
          this.contractDataGet()
        }

      },
      //计算天数
      datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
        let dateSpan
        let iDays
        sDate1 = Date.parse(sDate1);
        sDate2 = Date.parse(sDate2);
        dateSpan = sDate2 - sDate1;
        dateSpan = Math.abs(dateSpan);
        iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
        return iDays
      },
      //获取差旅费和工资
      getPersonTips(){
        if(this.newPersonForm.beginDateString&&this.newPersonForm.endDateString){
          let id =[]
          for (let i =0;i<this.newPersonForm.staffName.length;i++){
            id[i] = this.newPersonForm.staffName[i].staffID
          }
          this.$http({
            url:this.$http.adornUrl('master/test/person/salary'),
            method:'post',
            data:this.$http.adornData({
              beginDateString:this.newPersonForm.beginDateString,
              endDateString:this.newPersonForm.endDateString,
              id:id
            })
          }).then(res=>{
            this.newPersonForm.pay = res.data.data[0]
            this.newPersonForm.amount = res.data.data[1]
          })
        }
      },
      //获取差旅费和工资
      getPersonTips2(){
        if(this.newPersonForm.beginDateString&&this.newPersonForm.endDateString){
          let id =[]
          id[0] =this.newPersonForm.staffID,
            this.$http({
              url:this.$http.adornUrl('master/test/person/salary'),
              method:'post',
              data:this.$http.adornData({
                beginDateString:this.newPersonForm.beginDateString,
                endDateString:this.newPersonForm.endDateString,
                id:id
              })
            }).then(res=>{
              this.newPersonForm.pay = res.data.data[0]
              this.newPersonForm.amount = res.data.data[1]
            })
        }
      },
      //计算车程费用
      vehicleCost(){
        if(this.newVehicleForm.beginDateString&&this.newVehicleForm.endDateString&&this.newVehicleForm.meter){
          let day = this.datedifference(this.newVehicleForm.beginDateString,this.newVehicleForm.endDateString)
          let result
          if(this.newVehicleForm.meter>0&&this.newVehicleForm.meter<=120){
            result = (600*day)
          }else{
            result = (600+(this.newVehicleForm.meter-120)*5)*day
          }
          this.newVehicleForm.totalPrice = result/10000
        }
      },
      //计算设备费用
      getEquipTips(){
        if(this.newEquipmentForm.beginDateString&&this.newEquipmentForm.endDateString) {
          let day = this.datedifference(this.newEquipmentForm.beginDateString,this.newEquipmentForm.endDateString)
          let equip = this.multipleSelection2
          let tips = 0
          for(let i =0;i<equip.length;i++){
            tips +=equip[i].dayDepreciation
          }
          // console.log(equip)
          tips = day * tips / 10000
          this.newEquipmentForm.totalPrice = tips
        }

      },
      getEquipTips2(){
        if(this.newEquipmentForm.beginDateString&&this.newEquipmentForm.endDateString) {
          let day = this.datedifference(this.newEquipmentForm.beginDateString,this.newEquipmentForm.endDateString)
          this.newEquipmentForm.totalPrice = this.newEquipmentForm.dayDepreciation * day / 10000
        }

      },
      change(number){
        this.txt = this.op[number].contractName
      }
    }
  }
</script>

<style scoped>

</style>
