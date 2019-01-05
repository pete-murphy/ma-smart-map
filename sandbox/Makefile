.PHONY: all clean

poo/1.txt:
	@mkdir -p $(dir $@)
	@echo "Poop 1" >> $@

poo/2.txt:
	@mkdir -p $(dir $@)
	@echo "Poop 2" >> $@

text/%.txt:
	@mkdir -p $(dir $@)
	@echo "Hello there" >> $@

sample/foo.txt: \
	text/bar.txt \
	poo/1.txt \
	poo/2.txt
	@mkdir -p $(dir $@)
	@(cat $<; cat poo/*.txt; echo {0..10}) > $@

clean:
	@rm -rf sample
	@rm -rf text
	@rm -rf poo

all: sample/foo.txt