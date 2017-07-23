--[[
	Panel
	@authors ${author}
	@date    2017-07-21
]]

local _ = class("Panel", function()
	return cc.Node:create()
end)

local varEvents = {
	
}

local clickDesc = {
	
}

function _:ctor()
	self:initPanel(varEvents, clickDesc, function()
		
	end)
end

function _:onVarCallback(varName, data)
	if varName == "XXX" then

	end
end

function _:onClickHandler(ref)
	if ref.___level == "xxx1" then

	elseif ref.___level == "xxx2" then
		
	end
end

function _:nodeEvent(event)
	if event == "enter" then
		for i,v in ipairs(varEvents) do
			xiaoz.VAR_CHANGE(v)
		end
	elseif event == "enterTransitionFinish" then

	elseif event == "exit" then

	elseif event == "exitTransitionStart" then

	elseif event == "cleanup" then
    	self:unregisterScriptHandler()
		var:removeEventListenerByTarget(self)
	end
end

return _