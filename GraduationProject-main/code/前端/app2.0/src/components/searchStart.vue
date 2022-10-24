<template>
	<div class="search-root full-page">
		<div class="close" @click="back">X</div>
		<div class="search-container">
			<input
				id="query-input"
				autocomplete="off"
				type="search"
				placeholder="请输入起点"
				autofocus="autofocus"
				v-model="startPlace"
				@keyup.enter="search"
			/>
		</div>
		<div class="root">
			<div class="results-contaniner">
				<div class="results-panel">
					<li
						v-for="item in matchedRecords"
						v-bind:key="item[0]"
						@click="chooseStart(item)"
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
	name: "searchStart",
	data() {
		return {
			flagStartOrDst: true,
			startPlace: global_.startPlace,
			records: global_.geoToPalceMap,
 //   records:[["A","B"],["C","A"],["B","C"],["A","B"],["C","A"],["B","C"],["A","B"]],
			manageResults: [],
			result: "",
		};
	},
	mounted() {
		if (global_.startPlace) {
			this.startPlace = global_.startPlace;
		}
	},
	computed: {
		matchedRecords() {
			// console.log("input changed")
			// console.log(this.records)
			if (this.startPlace !== "") {
				let newRecords = new Map();
				global_.geoToPalceMap.forEach((value, key) => {
					if (value.indexOf(this.startPlace) != -1) {
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
			eventBus.$emit("isSearchStart", false);
		},
		search: function () {
			console.log("begin to search start");
		},
		chooseStart: function (item) {
			console.log("已选择start palce:" + item[1]);
			this.startPlace = item[1];
			global_.startGeohash = item[0];
      eventBus.$emit("comfirmStart",item[1],item[0]);
      this.back();
		},
	},
};
</script>
<style>
.full-page {
	position: absolute;
  bottom: 0;
	width: 100%;
	height: 700px;
	color: #333;
	background: #fff;
  animation: move;
  animation-duration: 0.5s;
  border-radius: 10px;
  overflow: hidden;
  z-index: 1;
}
.search-container {
  margin-top:50px;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	width: 100%;
	justify-content: space-between;
	height: 50px;
	padding: 0 20px 0 10px;
	background: #fff;
	box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.16);
	box-sizing: border-box;
}
.search-container input {
	-webkit-box-flex: 1;
	-ms-flex-positive: 1;
	flex-grow: 1;
	font-size: 16px;
	color: #333;
	padding: 0 10px 0 3px;
	border: none;
}
.root{
    overflow: hidden;
}
.results-contaniner {
	margin: 60px 8px 10px;
	background: #fff;
	border-radius: 5px;
	-webkit-box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
    overflow: hidden;
}
.results-contaniner .results-panel {
	padding: 2px 15px 15px 15px;
	background: #fff;
	border-radius: 4px;
  overflow: scroll;
}
.results-item {
	position: relative;
	display: -webkit-box;
	-webkit-box-pack: justify;
	-webkit-box-align: center;

	display: flex;
	-ms-flex-pack: justify;
	justify-content: space-between;
	-ms-flex-align: center;
	align-items: center;
}
.results-item .poi-icon {
	width: 12px;
	height: 15px;
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAdCAMAAACZrWzKAAAAdVBMVEUAAAAzMzM0NDQzMzM2NjY3NzczMzM2NjY5OTk9PT0zMzM0NDQ0NDQzMzM0NDQzMzM0NDQzMzM1NTUzMzMzMzM0NDQ3Nzc3NzczMzMzMzMzMzMzMzMzMzM+Pj5VVVUzMzM0NDQzMzM1NTU1NTU2NjY5OTkzMzPwJRX6AAAAJnRSTlMA9WXULiClEw0K8Jn8u4Lntmlf27NTOCXrsHhxWggDwqCNTn45G5pcRoEAAAEJSURBVCjPbZDZcoMwDEUlG2MWs5NAQkKWtvf/P7ERhnFKc16sOSNfSyaPVX3H3PXKUiAtGStcpps1GqjbIU2Htga0WW0FfaSVb41q8alGkYTApICWnBJabPAaJZFl+IRIqYiEI9iSQr30xHgRL/dqKOrRShkjy/MMsdQteuowSAIyQ2QySM6AjhjyrkIufTmUzAYmh3mvZziqYPYhPxipwGX/5AEFTSj2A54wfVgncmyJHtBXeuOq8fBfdX/X97UtYpTBfoEjXz0dzptt4J5bfYFM6WeThUIPGzkNy71A7Kevl30CdsRBIkYbnI85yXoN/cU6ThJ2lnbc0LS40R6FFxP941xV5Uwrv6n2FlxA6s2iAAAAAElFTkSuQmCC);
}
.results-item .item-icon {
	background-size: contain;
	background-repeat: no-repeat;
}
.results-item .right {
	display: -webkit-box;
	-webkit-box-pack: justify;
	-webkit-box-align: center;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-pack: justify;
	justify-content: space-between;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-flex: 1;
	-ms-flex-positive: 1;
	flex-grow: 1;
	height: 100%;
	margin-left: 16px;
	border-bottom: 1px solid #f0f0f0;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	padding: 15px 0;
}
.results-item .right .tohere {
	width: 11px;
	height: 11px;
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAANlBMVEUAAACtsbSrr7OrsLOqrrOqsbiqr7Kqr7OrsLSqr7Oqr7Wwtbqqr7OqrrOrsLOssLKss7OqrrJ2Otb1AAAAEXRSTlMAQfWaciTbjTrAYRjw0KpxKEtY6OkAAABaSURBVCjPvc45FoAgEATRwRXBbe5/WSNssJ6JgZX+pOxzeWzKkuCP0k2D+zpVbbEm761JtHfFQHMoRjIZSAaSgWQgGUlGkpFkJBmJdhSinUs0mPrB0qvVa+wCcI8Fljpm/iAAAAAASUVORK5CYII=);
	background-repeat: no-repeat;
	background-size: contain;
}

.hide {
	display: none !important;
}
li {
	list-style: none;
}
</style>