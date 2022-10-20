<template>
  <div class="search-root full-page">
    		<div class="close" @click="back">X</div>
    <div class="search-container">
      <input
        id="query-input"
        autocomplete="off"
        type="search"
        placeholder="请输入终点"
        autofocus="autofocus"
        v-model="dstPlace"
        @keyup.enter="search"
      />
    </div>
    <div class="root" >
      <div class="results-contaniner">
        <div class="results-panel">
          <li
            v-for="item in matchedRecords"
            v-bind:key="item.index"
            @click="chooseDst(item)"
          >
            <div class="results-item">
              <div class="item-icon poi-icon"></div>
              <div class="right">
                <div class="poi-info">
                  <div class="name text-overflow">{{ item[1] }}</div>
                  <div class="address text-overflow"></div>
                </div>
                <div class="tohere"></div>
              </div>
            </div>
          </li>
        </div>
      </div>
    </div>
    <!---->
  </div>
</template>
<script>
import global_ from "./Global.vue";

export default {
  name: "searchDst",
  data() {
    return {
      flagStartOrDst: true,
      dstPlace: global_.dstPlace,
     records: global_.geoToPalceMap,
     //  records:[["A","B"],["C","A"],["B","C"],["A","B"],["C","A"],["B","C"],["A","B"]],
      manageResults: [],
      result: "",
    };
  },
  computed: {
    matchedRecords() {
      if (this.dstPlace !== "") {
        let newRecords = new Map();
        global_.geoToPalceMap.forEach((value, key) => {
          if (value.indexOf(this.dstPlace) != -1) {
            newRecords.set(key, value);
          }
        });
        return newRecords;
      }
      return this.records;
    },
  },
  methods: {
    		back: function () {
			eventBus.$emit("isSearchDst", false);
		},
    search: function () {
      console.log("begin to search start");
    },

    chooseDst: function (item) {
      console.log("已选择dst palce:" + item[1]);
      this.dstPlace = item[1];
      global_.dstPlace = item[1];
      global_.dstGeohash = item[0];
         eventBus.$emit("comfirmDst",item[1],item[0]);
      this.back();
    },
  },
};
</script>
