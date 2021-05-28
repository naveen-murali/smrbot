flash_value = []

def flash(key, value=""):
    global flash_value
    
    if not value:
        for i in flash_value:
            if i["key"] == key:
                value = i["value"]
                flash_value.remove(i)
                return value
            continue
        return ""

    for i in flash_value:
        if i["key"] == key:
            i["value"].append(value)
            return
        continue
    flash_value.append({"key": key, "value": [value]})