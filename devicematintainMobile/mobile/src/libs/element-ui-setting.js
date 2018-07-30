/**
 * elementui 设置
 */

import ElementUI from 'element-ui';
import { isObject } from 'mpit-utils/libs/utils';

// 设置表格默认属性
Object.assign(ElementUI.Table.props, {
	size: {
		type: String,
		default: 'mini'
	},
	border: {
		type: Boolean,
		default: true
	},
	highlightCurrentRow: {
		type: Boolean,
		default: true
	}
});

// 设置表格单元格内容溢出隐藏，用tooltip显示
ElementUI.TableColumn.props.showOverflowTooltip = {
	type: Boolean,
	default: true
};

// 设置textarea默认显示4行
ElementUI.Input.props.autosize = {
	type: [Boolean, Object],
	default() {		
		return {
			minRows: 4
		};
	}
};

// 设置InputNumber默认min
ElementUI.InputNumber.props.min.default = 0;

// 修改Loading调用方式，并添加一个关闭loading框的方法
{
	const Loading = ElementUI.Loading;
	let loadingInstance;
	Loading.show = function (opt) {
		opt = isObject(opt) ? opt : {
			text: opt || '',
			background: 'rgba(0, 0, 0, 0.5)'
		};

		return loadingInstance = Loading.service(opt);
	};
	Loading.hide = function () {
		loadingInstance && loadingInstance.close();
	};
}

// 重写Message的方法
{
	const Message = ElementUI.Message;
	let oldWarning = Message.warning;
	let oldError = Message.error;
	let oldSuccess = Message.success;

	Message.warning = function (options) {
		if (typeof options === 'string') {
			options = {
				message: options,
				duration: 5000
			};
		}
		return oldWarning(options);
	};
	Message.error = function (options) {
		if (typeof options === 'string') {
			options = {
				message: options,
				duration: 5000
			};
		}
		return oldError(options);
	};
	Message.success = function (options) {
		if (typeof options === 'string') {
			options = {
				message: options,
				duration: 1500
			};
		}
		return oldSuccess(options);
	};
}

// 设置switch默认打开颜色
ElementUI.Switch.props.activeColor.default = '#13ce66';

// 重写menu hover 背景色
ElementUI.Menu.computed.hoverBackground = function() {
	return 'rgba(204, 204, 204, .5)';
};